import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

export type S3ThirdPartyAnswerPersonGet = {
  key: string
  s3_client: S3Client
}

export type S3PersonAnalysisAnswerThirdPartyGetParams = any | undefined

const S3_PERSON_ANALYSIS_ANSWER = getStringEnv('S3_PERSON_ANALYSIS_ANSWER')

const s3PersonAnalysisAnswerThirdPartyGet = async ({
  key,
  s3_client,
}: S3ThirdPartyAnswerPersonGet): Promise<S3PersonAnalysisAnswerThirdPartyGetParams> => {
  logger.debug({
    message: 'S3: GetObject',
    bucket: S3_PERSON_ANALYSIS_ANSWER,
    key,
  })

  const get_command = new GetObjectCommand({
    Bucket: S3_PERSON_ANALYSIS_ANSWER,
    Key: key,
  })

  const result = await s3_client.send(get_command)

  const body = await result.Body?.transformToString()

  if (!body) {
    logger.debug({
      message: 'There is no data in this bucket and key',
      bucket: S3_PERSON_ANALYSIS_ANSWER,
      key,
    })

    return undefined
  }

  return body
}

export default s3PersonAnalysisAnswerThirdPartyGet
