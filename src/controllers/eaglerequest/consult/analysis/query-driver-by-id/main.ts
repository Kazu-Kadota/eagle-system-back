import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'

import queryRequestPersonByIdAdapter from './query-request-person-by-id-adapter'

import validatePersonParam from './validate-param'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const queryPersonByIdController = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  const { person_id } = validatePersonParam({ ...event.pathParameters })

  const request_person = await queryRequestPersonByIdAdapter(person_id, user_info, dynamodbClient)

  return {
    body: {
      message: 'Finish on get person request info',
      person: request_person,
    },
  }
}

export default queryPersonByIdController
