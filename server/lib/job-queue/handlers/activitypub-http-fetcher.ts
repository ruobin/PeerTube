import * as Bull from 'bull'
import * as Bluebird from 'bluebird'
import { logger } from '../../../helpers/logger'
import { processActivities } from '../../activitypub/process'
import { addVideoComments } from '../../activitypub/video-comments'
import { crawlCollectionPage } from '../../activitypub/crawl'
import { VideoModel } from '../../../models/video/video'
import { addVideoShares, createRates } from '../../activitypub'
import { createAccountPlaylists } from '../../activitypub/playlist'
import { AccountModel } from '../../../models/account/account'
import { AccountVideoRateModel } from '../../../models/account/account-video-rate'
import { VideoShareModel } from '../../../models/video/video-share'
import { VideoCommentModel } from '../../../models/video/video-comment'

type FetchType = 'activity' | 'video-likes' | 'video-dislikes' | 'video-shares' | 'video-comments' | 'account-playlists'

export type ActivitypubHttpFetcherPayload = {
  uri: string
  type: FetchType
  videoId?: number
  accountId?: number
}

async function processActivityPubHttpFetcher (job: Bull.Job) {
  logger.info('Processing ActivityPub fetcher in job %d.', job.id)

  const payload = job.data as ActivitypubHttpFetcherPayload

  let video: VideoModel
  if (payload.videoId) video = await VideoModel.loadAndPopulateAccountAndServerAndTags(payload.videoId)

  let account: AccountModel
  if (payload.accountId) account = await AccountModel.load(payload.accountId)

  const fetcherType: { [ id in FetchType ]: (items: any[]) => Promise<any> } = {
    'activity': items => processActivities(items, { outboxUrl: payload.uri, fromFetch: true }),
    'video-likes': items => createRates(items, video, 'like'),
    'video-dislikes': items => createRates(items, video, 'dislike'),
    'video-shares': items => addVideoShares(items, video),
    'video-comments': items => addVideoComments(items),
    'account-playlists': items => createAccountPlaylists(items, account)
  }

  const cleanerType: { [ id in FetchType ]?: (crawlStartDate: Date) => Bluebird<any> } = {
    'video-likes': crawlStartDate => AccountVideoRateModel.cleanOldRatesOf(video.id, 'like' as 'like', crawlStartDate),
    'video-dislikes': crawlStartDate => AccountVideoRateModel.cleanOldRatesOf(video.id, 'dislike' as 'dislike', crawlStartDate),
    'video-shares': crawlStartDate => VideoShareModel.cleanOldSharesOf(video.id, crawlStartDate),
    'video-comments': crawlStartDate => VideoCommentModel.cleanOldCommentsOf(video.id, crawlStartDate)
  }

  return crawlCollectionPage(payload.uri, fetcherType[payload.type], cleanerType[payload.type])
}

// ---------------------------------------------------------------------------

export {
  processActivityPubHttpFetcher
}
