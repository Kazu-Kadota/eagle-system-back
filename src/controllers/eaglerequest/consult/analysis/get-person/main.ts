import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { PersonRequestKey } from 'src/models/dynamo/request-person'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import getRequestPersonAdapter from './get-person-adapter'
import validatePersonParam from './validate-param'
import validatePersonQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const getPersonByRequestIdController = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  const { person_id } = validatePersonParam({ ...event.pathParameters })
  const { request_id } = validatePersonQuery({ ...event.queryStringParameters })

  const request_person_key: PersonRequestKey = {
    person_id,
    request_id,
  }

  const request_person = await getRequestPersonAdapter(request_person_key, user_info, dynamodbClient)

  logger.info({
    message: 'Finish on get person request info',
    request_id,
    person_id,
  })

  return {
    body: {
      message: 'Finish on get request person',
      person: request_person,
    },
  }
}

export default getPersonByRequestIdController
