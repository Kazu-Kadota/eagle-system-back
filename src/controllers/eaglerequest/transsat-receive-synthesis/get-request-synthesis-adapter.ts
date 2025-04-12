import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SynthesisRequestBody, SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import getRequestSynthesis from 'src/services/aws/dynamo/request/synthesis/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type GetRequestSynthesisAdapterParams = {
  request_id: string
  synthesis_id: string
  dynamodbClient: DynamoDBClient
}

const getRequestSynthesisAdapter = async (params: GetRequestSynthesisAdapterParams): Promise<SynthesisRequestBody> => {
  const synthesis_key: SynthesisRequestKey = {
    request_id: params.request_id,
    synthesis_id: params.synthesis_id,
  }
  const synthesis = await getRequestSynthesis(synthesis_key, params.dynamodbClient)

  if (!synthesis) {
    logger.warn({
      message: 'synthesis not exist',
      ...synthesis_key,
    })

    throw new ErrorHandler('synthesis not exist', 404)
  }

  const { synthesis_id, request_id, ...synthesis_body } = synthesis

  return synthesis_body
}

export default getRequestSynthesisAdapter
