import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import putUser from 'src/services/aws/dynamo/user/user/put'
import queryByEmail, { QueryByEmailQuery } from 'src/services/aws/dynamo/user/user/query-by-email'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'
import { v4 as uuid } from 'uuid'

import hashPassword from './hash-password'
import validateRegister from './validate'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const registerUser = async (event: APIGatewayProxyEvent): Promise<ReturnResponse<any>> => {
  const body = validateRegister(JSON.parse(event.body as string))

  const query_by_email: QueryByEmailQuery = {
    email: body.email,
  }

  const emailExist = await queryByEmail(query_by_email, dynamodbClient)

  if (!emailExist || emailExist.length !== 0) {
    logger.warn({
      message: 'E-mail already exist',
      email: body.email,
    })

    throw new ErrorHandler('E-mail já existe', 409)
  }

  const key = {
    user_id: uuid(),
  }

  body.password = hashPassword(body.password)

  await putUser(key, body, dynamodbClient)

  logger.info({
    message: 'User registered successfully',
    email: body.email,
  })

  return {
    body: {
      message: 'User registered successfully',
      email: body.email,
    },
  }
}

export default registerUser
