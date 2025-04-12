import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { S3Client } from '@aws-sdk/client-s3'
import { VehicleRequest } from 'src/models/dynamo/request-vehicle'
import { EventBridgeThirdPartyAnalysisAnswerProducerDetailsType, EventBridgeThirdPartyAnalysisAnswerProducerSource } from 'src/models/eventbridge/third-party-analysis-answer-producer'
import eventBridgeAnalysisAnswerProducerPutEvent from 'src/services/aws/eventBridge/third-party/analysis-answer-producer/put-event'
import s3VehicleAnalysisAnswerThirdPartyGetSignedUrl from 'src/services/aws/s3/vehicle-analysis/answer/third-party/get-signed-url'

export type SendPresignedUrlParams = {
  event_bridge_client: EventBridgeClient
  finished_vehicle: VehicleRequest
  s3_client: S3Client
  s3_key: string
}

const sendPresignedUrl = async ({
  event_bridge_client,
  finished_vehicle,
  s3_client,
  s3_key,
}: SendPresignedUrlParams) => {
  if (!finished_vehicle.postback) {
    return undefined
  }

  const s3_presigned_url = await s3VehicleAnalysisAnswerThirdPartyGetSignedUrl({
    key: s3_key,
    s3_client,
  })

  await eventBridgeAnalysisAnswerProducerPutEvent({
    detail: {
      ...finished_vehicle.metadata,
      vehicle_analysis_type: finished_vehicle.vehicle_analysis_type,
      s3_presigned_url,
    },
    detail_type: EventBridgeThirdPartyAnalysisAnswerProducerDetailsType.VEHICLE_PRESIGNED_URL_GENERATED,
    eventBridgeClient: event_bridge_client,
    source: EventBridgeThirdPartyAnalysisAnswerProducerSource.EAGLESYSTEM,
  })
}

export default sendPresignedUrl
