import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
// import { Readable } from 'stream'

export type S3PersonAnalysisAnswerGet = {
  key: string
  s3_client: S3Client
}

export type S3PersonAnalysisAnswerGetParams = any | undefined

const S3_PERSON_ANALYSIS_ANSWER = getStringEnv('S3_PERSON_ANALYSIS_ANSWER')

const s3PersonAnalysisAnswerGet = async ({
  key,
  s3_client,
}: S3PersonAnalysisAnswerGet): Promise<S3PersonAnalysisAnswerGetParams> => {
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

  /*
    try {
    const result = await s3_client.send(get_command)
    const stream = result.Body as Readable

    if (!stream) {
      logger.debug({
        message: 'There is no data in this bucket and key',
        bucket: S3_PERSON_ANALYSIS_ANSWER,
        key,
      })

      return undefined
    }

    let data = ''

    for await (const chunk of stream) {
      data += chunk.toString()
    }

    return JSON.parse(data)
  } catch (error) {
    logger.error({ message: 'Error retrieving file from S3', error })
    throw error
  },
  */
}

export default s3PersonAnalysisAnswerGet
