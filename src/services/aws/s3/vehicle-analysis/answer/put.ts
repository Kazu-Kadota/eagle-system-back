import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { AnalysisTypeEnum, VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import { gzipSync } from 'zlib'

export type S3VehicleAnalysisAnswerPut = {
  analysis_type: AnalysisTypeEnum
  body?: string
  vehicle_analysis_type: VehicleAnalysisTypeEnum
  vehicle_id: string
  request_id: string
  s3_client: S3Client
}

const S3_VEHICLE_ANALYSIS_ANSWER = getStringEnv('S3_VEHICLE_ANALYSIS_ANSWER')

const s3VehicleAnalysisAnswerPut = async ({
  analysis_type,
  body,
  vehicle_analysis_type,
  vehicle_id,
  request_id,
  s3_client,
}: S3VehicleAnalysisAnswerPut) => {
  logger.debug({
    message: 'S3: PutObject',
    bucket: S3_VEHICLE_ANALYSIS_ANSWER,
    vehicle_analysis_type,
    vehicle_id,
    request_id,
  })

  const key = `${analysis_type}/${vehicle_id}/${request_id}/answer/${vehicle_analysis_type}.json`

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

export default s3VehicleAnalysisAnswerPut
