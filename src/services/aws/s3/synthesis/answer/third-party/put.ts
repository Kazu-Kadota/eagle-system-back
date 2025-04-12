import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { SynthesisThirdPartyEnum } from 'src/models/dynamo/request-enum'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import { gzipSync } from 'zlib'

export type S3SynthesisInformationThirdPartyPut = {
  body?: string
  is_text_input: boolean
  request_id: string
  s3_client: S3Client
  synthesis_id: string
  third_party: SynthesisThirdPartyEnum
}

const S3_SYNTHESIS_INFORMATION = getStringEnv('S3_SYNTHESIS_INFORMATION')

const s3SynthesisInformationThirdPartyPut = async ({
  body,
  is_text_input,
  request_id,
  s3_client,
  synthesis_id,
  third_party,
}: S3SynthesisInformationThirdPartyPut) => {
  logger.debug({
    message: 'S3: PutObject',
    bucket: S3_SYNTHESIS_INFORMATION,
    is_text_input,
    request_id,
    synthesis_id,
    third_party,
  })

  const text = is_text_input ? 'text_input' : 'text_output'

  const key = `${synthesis_id}/${request_id}/${third_party}/${text}.json`

  const body_uncompressed = body ?? ''

  const gzip_body = gzipSync(body_uncompressed)

  const put_command = new PutObjectCommand({
    Bucket: S3_SYNTHESIS_INFORMATION,
    Key: key,
    Body: gzip_body.toString('base64'),
  })

  await s3_client.send(put_command)

  return key
}

export default s3SynthesisInformationThirdPartyPut
