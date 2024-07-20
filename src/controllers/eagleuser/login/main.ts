import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import jwt, { SignOptions } from 'jsonwebtoken'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import { Without } from 'src/utils/types/without'
import { v4 as uuid } from 'uuid'

import getCompanyByNameAdapter from './get-company-adapter'
import getUserByEmailAdapter from './get-user-by-email-adapter'
import validateLogin from './validate'
import validatePassword from './validate-password'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })
const AUTH_ES256_PRIVATE_KEY = getStringEnv('AUTH_ES256_PRIVATE_KEY')

const login = async (event: APIGatewayProxyEvent): Promise<ReturnResponse<any>> => {
  logger.debug({
    message: 'Start login path',
  })

  const { email, password } = validateLogin(JSON.parse(event.body as string))

  const user = await getUserByEmailAdapter(email, dynamodbClient)

  const company = await getCompanyByNameAdapter(user.company_name, dynamodbClient)

  validatePassword(user, password)

  const jwt_id = uuid()

  let expires_seconds

  if (user.api) {
    expires_seconds = 60 * 60 * 24 * 30
  } else {
    expires_seconds = 60 * 60 * 16
  }

  const expires_date = new Date()

  expires_date.setSeconds(expires_date.getSeconds() + expires_seconds)

  const payload: Without<UserInfoFromJwt, 'user_id'> = {
    api: user.api,
    email: user.email,
    user_first_name: user.user_first_name,
    user_last_name: user.user_last_name,
    user_type: user.user_type,
    company_name: user.company_name,
    company_id: company.company_id,
  }

  const private_key = AUTH_ES256_PRIVATE_KEY

  const options: SignOptions = {
    expiresIn: expires_seconds,
    algorithm: 'ES256',
    subject: user.user_id,
    jwtid: jwt_id,
  }

  const jwtToken = jwt.sign(
    payload,
    private_key,
    options,
  )

  logger.info({
    message: 'User logged successfully',
    user_id: user.user_id,
  })

  return {
    body: {
      message: 'User logged successfully',
      user: {
        api: user.api,
        email: user.email,
        user_first_name: user.user_first_name,
        user_last_name: user.user_last_name,
        user_type: user.user_type,
        company_name: user.company_name,
        company_id: company.company_id,
      },
      jwtToken,
      expires_date,
    },
  }
}

export default login
