import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { AnalysisTypeEnum, VehicleAnalysisTypeEnum, VehicleThirdPartyEnum } from 'src/models/dynamo/request-enum'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import { gzipSync } from 'zlib'

export type S3ThirdPartyAnswerVehiclePut = {
  analysis_type: AnalysisTypeEnum
  body?: string
  vehicle_analysis_type: VehicleAnalysisTypeEnum
  vehicle_id: string
  request_id: string
  s3_client: S3Client
  third_party: VehicleThirdPartyEnum
}

const S3_VEHICLE_ANALYSIS_ANSWER = getStringEnv('S3_VEHICLE_ANALYSIS_ANSWER')

const s3VehicleAnalysisAnswerThirdPartyPut = async ({
  analysis_type,
  body,
  vehicle_analysis_type,
  vehicle_id,
  request_id,
  s3_client,
  third_party,
}: S3ThirdPartyAnswerVehiclePut) => {
  logger.debug({
    message: 'S3: PutObject',
    bucket: S3_VEHICLE_ANALYSIS_ANSWER,
    vehicle_analysis_type,
    vehicle_id,
    request_id,
    third_party,
  })

  const key = `${analysis_type}/${vehicle_id}/${request_id}/answer/${third_party}/${vehicle_analysis_type}.json`

  const body_uncompressed = body ?? ''

  const gzip_body = gzipSync(body_uncompressed)

  const put_command = new PutObjectCommand({
    Bucket: S3_VEHICLE_ANALYSIS_ANSWER,
    Key: key,
    Body: gzip_body.toString('base64'),
  })

  await s3_client.send(put_command)

  return key
}

export default s3VehicleAnalysisAnswerThirdPartyPut
