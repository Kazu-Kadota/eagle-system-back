import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { UserKey } from 'src/models/dynamo/user'
import { ReturnResponse } from 'src/models/lambda'
import getUser from 'src/services/aws/dynamo/user/user/get'
import updateUser from 'src/services/aws/dynamo/user/user/update'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import hashPassword from './hash-password'

import validateBody from './validate'
import validatePassword from './validate-password'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const changePasswordController = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  const user_id = user_info.user_id

  const { old_password, password } = validateBody(JSON.parse(event.body as string))

  const user_key: UserKey = {
    user_id,
  }

  const user = await getUser(user_key, dynamodbClient)

  if (!user) {
    logger.warn({
      message: 'User not found',
    })

    throw new ErrorHandler('Usuário não encontrado', 404)
  }

  validatePassword(user, old_password)

  const new_password = hashPassword(password)

  const key = {
    user_id,
  }

  const body = {
    password: new_password,
  }

  await updateUser(key, body, dynamodbClient)

  logger.info({
    message: 'Password changed successfully',
    user_id,
  })

  return {
    body: {
      message: 'Password changed successfully',
      user_id,
    },
  }
}

export default changePasswordController
