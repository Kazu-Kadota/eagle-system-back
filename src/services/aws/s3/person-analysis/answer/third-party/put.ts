import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { AnalysisTypeEnum, PersonAnalysisTypeEnum, PersonThirdPartyEnum, StateEnum } from 'src/models/dynamo/request-enum'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import { gzipSync } from 'zlib'

export type S3ThirdPartyAnswerPersonPut = {
  analysis_type: AnalysisTypeEnum
  body?: string
  person_analysis_type: PersonAnalysisTypeEnum
  person_id: string
  region?: StateEnum
  request_id: string
  s3_client: S3Client
  third_party: PersonThirdPartyEnum
}

const S3_PERSON_ANALYSIS_ANSWER = getStringEnv('S3_PERSON_ANALYSIS_ANSWER')

const s3PersonAnalysisAnswerThirdPartyPut = async ({
  analysis_type,
  body,
  person_analysis_type,
  person_id,
  region,
  request_id,
  s3_client,
  third_party,
}: S3ThirdPartyAnswerPersonPut) => {
  logger.debug({
    message: 'S3: PutObject',
    bucket: S3_PERSON_ANALYSIS_ANSWER,
    person_analysis_type,
    person_id,
    region,
    request_id,
    third_party,
  })

  let key = `${analysis_type}/${person_id}/${request_id}/answer/${third_party}/${person_analysis_type}`

  if (region) {
    key = key.concat('_', region, '.json')
  } else {
    key = key.concat('.json')
  }

  const body_uncompressed = body ?? ''

  const gzip_body = gzipSync(body_uncompressed)

  const put_command = new PutObjectCommand({
    Bucket: S3_PERSON_ANALYSIS_ANSWER,
    Key: key,
    Body: gzip_body.toString('base64'),
  })

  await s3_client.send(put_command)

  return key
}

export default s3PersonAnalysisAnswerThirdPartyPut
