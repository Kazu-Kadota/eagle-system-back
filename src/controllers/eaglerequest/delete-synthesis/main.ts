import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Controller } from 'src/models/lambda'
import deleteSynthesis from 'src/services/aws/dynamo/request/synthesis/delete'
import getRequestSynthesis from 'src/services/aws/dynamo/request/synthesis/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import validateBodyDeleteAnalysisSynthesis from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const deleteSynthesisController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const synthesis_key = validateBodyDeleteAnalysisSynthesis(event_body)

  const synthesis = await getRequestSynthesis(synthesis_key, dynamodbClient)

  if (!synthesis) {
    logger.warn({
      message: 'Synthesis not exist',
      ...synthesis_key,
    })

    throw new ErrorHandler('Síntese não existe', 404)
  }

  await deleteSynthesis(synthesis_key, dynamodbClient)

  logger.info({
    message: 'Successfully deleted synthesis',
    ...synthesis_key,
    company_name: user_info.company_name,
    user_id: user_info.user_id,
  })

  return {
    body: {
      message: 'Successfully deleted synthesis',
      ...synthesis_key,
    },
  }
}

export default deleteSynthesisController
