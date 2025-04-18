import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SynthesisRequestBody, SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import { UserGroupEnum } from 'src/models/dynamo/user'
import getRequestSynthesis from 'src/services/aws/dynamo/request/synthesis/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

export type GetRequestSynthesisAdapterParams = {
  request_id: string
  synthesis_id: string
  dynamodbClient: DynamoDBClient
  user_info: UserInfoFromJwt
}

const getRequestSynthesisAdapter = async (params: GetRequestSynthesisAdapterParams): Promise<SynthesisRequestBody> => {
  const synthesis_key: SynthesisRequestKey = {
    request_id: params.request_id,
    synthesis_id: params.synthesis_id,
  }
  const synthesis = await getRequestSynthesis(synthesis_key, params.dynamodbClient)

  if (!synthesis) {
    logger.warn({
      message: 'Synthesis not exist',
      ...synthesis_key,
    })

    throw new ErrorHandler('Synthesis not exist', 404)
  }

  const is_client_not_same_company = params.user_info.user_type === UserGroupEnum.CLIENT
    && synthesis.company_name !== params.user_info.company_name

  if (is_client_not_same_company) {
    logger.warn({
      message: 'Client not requested to synthesis this information',
      ...synthesis_key,
    })

    throw new ErrorHandler('Synthesis not exist', 404)
  }

  const { synthesis_id, request_id, ...synthesis_body } = synthesis

  return synthesis_body
}

export default getRequestSynthesisAdapter
