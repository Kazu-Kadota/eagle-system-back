import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

export type S3ThirdPartyAnswerVehicleGetSignedUrl = {
  key: string
  s3_client: S3Client
}

const S3_VEHICLE_ANALYSIS_ANSWER = getStringEnv('S3_VEHICLE_ANALYSIS_ANSWER')

const s3VehicleAnalysisAnswerThirdPartyGetSignedUrl = async ({
  key,
  s3_client,
}: S3ThirdPartyAnswerVehicleGetSignedUrl) => {
  logger.debug({
    message: 'S3: GetSignedURL',
    bucket: S3_VEHICLE_ANALYSIS_ANSWER,
  })

  const get_command = new GetObjectCommand({
    Bucket: S3_VEHICLE_ANALYSIS_ANSWER,
    Key: key,
  })

  const signed_url = await getSignedUrl(s3_client, get_command, {
    expiresIn: 900,
  })

  return signed_url
}

export default s3VehicleAnalysisAnswerThirdPartyGetSignedUrl
