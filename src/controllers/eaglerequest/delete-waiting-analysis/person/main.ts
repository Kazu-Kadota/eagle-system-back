import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Controller } from 'src/models/lambda'
import deleteRequestPerson from 'src/services/aws/dynamo/request/analysis/person/delete'
import getRequestPerson from 'src/services/aws/dynamo/request/analysis/person/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import validateBodyDeleteWaitingAnalysisPerson from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const deleteWaitingAnalysisPersonController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const person_request_key = validateBodyDeleteWaitingAnalysisPerson(event_body)

  const request_person = await getRequestPerson(person_request_key, dynamodbClient)

  if (!request_person) {
    logger.warn({
      message: 'Person not exist',
      ...person_request_key,
    })

    throw new ErrorHandler('Pessoa não existe', 404)
  }

  await deleteRequestPerson(person_request_key, dynamodbClient)

  logger.info({
    message: 'Successfully deleted waiting person analysis',
    ...person_request_key,
    company_name: user_info.company_name,
    user_id: user_info.user_id,
  })

  return {
    body: {
      message: 'Successfully deleted waiting person analysis',
      ...person_request_key,
    },
  }
}

export default deleteWaitingAnalysisPersonController
