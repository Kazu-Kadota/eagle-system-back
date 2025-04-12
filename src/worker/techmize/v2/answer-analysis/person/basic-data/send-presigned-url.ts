import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { S3Client } from '@aws-sdk/client-s3'
import { PersonRequest } from 'src/models/dynamo/request-person'
import { EventBridgeThirdPartyAnalysisAnswerProducerDetailsType, EventBridgeThirdPartyAnalysisAnswerProducerSource } from 'src/models/eventbridge/third-party-analysis-answer-producer'
import eventBridgeAnalysisAnswerProducerPutEvent from 'src/services/aws/eventBridge/third-party/analysis-answer-producer/put-event'
import s3PersonAnalysisAnswerThirdPartyGetSignedUrl from 'src/services/aws/s3/person-analysis/answer/third-party/get-signed-url'

export type SendPresignedUrlParams = {
  event_bridge_client: EventBridgeClient
  finished_person: PersonRequest
  s3_client: S3Client
  s3_key: string
}

const sendPresignedUrl = async ({
  event_bridge_client,
  finished_person,
  s3_client,
  s3_key,
}: SendPresignedUrlParams) => {
  if (!finished_person.postback) {
    return undefined
  }

  const s3_presigned_url = await s3PersonAnalysisAnswerThirdPartyGetSignedUrl({
    key: s3_key,
    s3_client,
  })

  await eventBridgeAnalysisAnswerProducerPutEvent({
    detail: {
      ...finished_person.metadata,
      person_analysis_type: finished_person.person_analysis_type,
      s3_presigned_url,
    },
    detail_type: EventBridgeThirdPartyAnalysisAnswerProducerDetailsType.PERSON_PRESIGNED_URL_GENERATED,
    eventBridgeClient: event_bridge_client,
    source: EventBridgeThirdPartyAnalysisAnswerProducerSource.EAGLESYSTEM,
  })
}

export default sendPresignedUrl
