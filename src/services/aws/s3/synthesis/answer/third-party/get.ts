import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

export type S3SynthesisInformationThirdPartyGetParams = {
  key: string
  s3_client: S3Client
}

export type S3SynthesisInformationThirdPartyGetResponse = string | undefined

const S3_SYNTHESIS_INFORMATION = getStringEnv('S3_SYNTHESIS_INFORMATION')

const s3SynthesisInformationThirdPartyGet = async ({
  key,
  s3_client,
}: S3SynthesisInformationThirdPartyGetParams): Promise<S3SynthesisInformationThirdPartyGetResponse> => {
  logger.debug({
    message: 'S3: GetObject',
    bucket: S3_SYNTHESIS_INFORMATION,
    key,
  })

  const get_command = new GetObjectCommand({
    Bucket: S3_SYNTHESIS_INFORMATION,
    Key: key,
  })

  const result = await s3_client.send(get_command)

  const body = await result.Body?.transformToString()

  if (!body) {
    logger.debug({
      message: 'There is no data in this bucket and key',
      bucket: S3_SYNTHESIS_INFORMATION,
      key,
    })

    return undefined
  }

  return body
}

export default s3SynthesisInformationThirdPartyGet
