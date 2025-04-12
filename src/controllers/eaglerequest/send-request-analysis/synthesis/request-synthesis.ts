import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { AnalysisTypeEnum, RequestStatusEnum, SynthesisThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { SynthesisRequestBody, SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import putRequestSynthesis from 'src/services/aws/dynamo/request/synthesis/put'
import s3SynthesisInformationThirdPartyPut from 'src/services/aws/s3/synthesis/answer/third-party/put'
import transsatSendRequestSynthesis from 'src/services/transsat/send-request-synthesis'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'
import { v4 as uuid } from 'uuid'
import { gunzipSync } from 'zlib'

export type SynthesisAnalysisResponse = {
  request_id: string
  synthesis_id: string
  status: RequestStatusEnum
}

export type SynthesisAnalysisRequest = {
  analysis_type: AnalysisTypeEnum
  company_name: string
  dynamodbClient: DynamoDBClient
  person_id?: string
  person_request_id?: string
  s3_client: S3Client
  text: string
  vehicle_id?: string
  vehicle_request_id?: string
  user_info: UserInfoFromJwt
}

const requestSynthesis = async ({
  analysis_type,
  company_name,
  dynamodbClient,
  text,
  person_id,
  person_request_id,
  s3_client,
  user_info,
  vehicle_id,
  vehicle_request_id,
}: SynthesisAnalysisRequest): Promise<SynthesisAnalysisResponse> => {
  logger.debug({
    message: 'Requested synthesis',
    analysis_type,
    company_name,
    user_id: user_info.user_id,
  })

  const request_id = uuid()
  const synthesis_id = uuid()

  const text_uncompressed = gunzipSync(text).toString('base64')

  const transsat_data = await transsatSendRequestSynthesis({
    texto: text_uncompressed,
  })

  const s3_path = await s3SynthesisInformationThirdPartyPut({
    is_text_input: true,
    request_id,
    s3_client,
    synthesis_id,
    third_party: SynthesisThirdPartyEnum.TRANSSAT,
    body: text_uncompressed,
  })

  const data_request_synthesis: SynthesisRequestBody = {
    analysis_type: AnalysisTypeEnum.SYNTHESIS,
    company_name,
    status: RequestStatusEnum.PROCESSING,
    text_input: s3_path,
    user_id: user_info.user_id,
    person_id,
    person_request_id,
    third_party: {
      company: SynthesisThirdPartyEnum.TRANSSAT,
      data: transsat_data,
    },
    vehicle_id,
    vehicle_request_id,
  }

  const request_synthesis_data = removeEmpty(data_request_synthesis)

  const request_synthesis_key: SynthesisRequestKey = {
    request_id,
    synthesis_id,
  }

  await putRequestSynthesis(request_synthesis_key, request_synthesis_data, dynamodbClient)

  return {
    request_id,
    status: RequestStatusEnum.PROCESSING,
    synthesis_id,
  }
}

export default requestSynthesis
