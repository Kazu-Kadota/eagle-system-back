import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

export type S3PersonAnalysisGetSignedUrl = {
  key: string
  s3_client: S3Client
}

const S3_PERSON_ANALYSIS_ANSWER = getStringEnv('S3_PERSON_ANALYSIS_ANSWER')

const s3PersonAnalysisAnswerGetSignedUrl = async ({
  key,
  s3_client,
}: S3PersonAnalysisGetSignedUrl) => {
  logger.debug({
    message: 'S3: GetSignedURL',
    bucket: S3_PERSON_ANALYSIS_ANSWER,
    key,
  })

  const get_command = new GetObjectCommand({
    Bucket: S3_PERSON_ANALYSIS_ANSWER,
    Key: key,
  })

  const signed_url = await getSignedUrl(s3_client, get_command, {
    expiresIn: 900,
  })

  return signed_url
}

export default s3PersonAnalysisAnswerGetSignedUrl
