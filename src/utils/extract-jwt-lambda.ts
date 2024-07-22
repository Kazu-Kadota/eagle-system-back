import { APIGatewayProxyEvent } from 'aws-lambda'
import jwt, { JwtPayload, VerifyOptions } from 'jsonwebtoken'
import { UserGroupEnum } from 'src/models/dynamo/user'
import getStringEnv from 'src/utils/get-string-env'

import ErrorHandler from './error-handler'

const AUTH_ES256_PRIVATE_KEY = getStringEnv('AUTH_ES256_PRIVATE_KEY')

export interface UserInfoFromJwt {
  api: boolean
  email: string
  company_id: string
  company_name: string
  user_first_name: string
  user_id: string,
  user_last_name: string
  user_type: UserGroupEnum,
}

const extractJwtLambda = (event: APIGatewayProxyEvent): UserInfoFromJwt | undefined => {
  try {
    const { Authorization } = event.headers

    if (!Authorization) {
      return
    }

    const token = Authorization.split(' ')[1]

    const private_key = AUTH_ES256_PRIVATE_KEY

    const options: VerifyOptions = {
      algorithms: ['ES256'],
    }

    const verify = jwt.verify(
      token,
      private_key,
      options,
    ) as JwtPayload

    const api = verify.api
    const email = verify.email
    const user_first_name = verify.user_first_name
    const user_last_name = verify.user_last_name
    const user_type = verify.user_type as UserGroupEnum
    const user_id = verify.sub as string
    const company_name = verify.company_name as string
    const company_id = verify.company_id as string

    return {
      api,
      email,
      user_first_name,
      user_last_name,
      user_type,
      user_id,
      company_name,
      company_id,
    }
  } catch {
    throw new ErrorHandler('Error on verify token', 498)
  }
}

export default extractJwtLambda
