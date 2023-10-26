import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { UserBody, UserKey } from 'src/models/dynamo/user'
import { PasswordHistoryBody, PasswordHistoryKey } from 'src/models/dynamo/users/password-history'
import { ReturnResponse } from 'src/models/lambda'
import putPasswordHistory from 'src/services/aws/dynamo/user/password-history/put'
import updateUser from 'src/services/aws/dynamo/user/user/update'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import getUserByEmailAdapter from './get-user-by-email-adapter'
import hashPassword from './hash-password'
import validateBody from './validate-body'
import validateQuery from './validate-query'
import validateRecoveryId from './validate-recovery-id'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const resetPasswordController = async (event: APIGatewayProxyEvent): Promise<ReturnResponse<any>> => {
  logger.debug({
    message: 'Start reset password path',
  })

  const body = validateBody(JSON.parse(event.body ?? ''))

  const query = validateQuery({ ...event.queryStringParameters })

  if (body.password !== body.confirm_password) {
    logger.warn({
      message: 'Password and confirm password is different',
    })

    throw new ErrorHandler('A confirmação de senha está incorreta', 400)
  }

  const user = await getUserByEmailAdapter(query.email, dynamodbClient)

  await validateRecoveryId(query.recovery_id, user, dynamodbClient)

  const new_password = hashPassword(body.password)

  const password_history_key: PasswordHistoryKey = {
    user_id: user.user_id,
    created_at: new Date().toISOString(),
  }

  const password_history_body: PasswordHistoryBody = {
    old_password: user.password,
    new_password,
  }

  await putPasswordHistory(password_history_key, password_history_body, dynamodbClient)

  const update_user_key: UserKey = {
    user_id: user.user_id,
  }

  const update_user_body: Partial<UserBody> = {
    password: new_password,
  }

  await updateUser(update_user_key, update_user_body, dynamodbClient)

  logger.info({
    message: 'Users password reset successfully',
    user_id: user.user_id,
  })

  return {
    body: {
      message: 'Users password reset successfully',
      user_id: user.user_id,
    },
  }
}

export default resetPasswordController
