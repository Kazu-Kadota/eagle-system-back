import { APIGatewayProxyEvent } from 'aws-lambda'
import jwt, { JwtPayload, VerifyOptions } from 'jsonwebtoken'
import { UserGroupEnum } from 'src/models/dynamo/user'
import getStringEnv from 'src/utils/get-string-env'

import ErrorHandler from './error-handler'

const AUTH_ES256_PRIVATE_KEY = getStringEnv('AUTH_ES256_PRIVATE_KEY')

export interface UserInfoFromJwt {
  user_type: UserGroupEnum,
  user_id: string,
  company_name: string
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

    const user_type = verify.user_type as UserGroupEnum
    const user_id = verify.sub as string
    const company_name = verify.company_name as string

    return {
      user_type,
      user_id,
      company_name,
    }
  } catch {
    throw new ErrorHandler('Error on verify token', 498)
  }
}

export default extractJwtLambda
