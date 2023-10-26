import { APIGatewayProxyEvent } from 'aws-lambda'
import jwt, { JwtPayload, VerifyOptions } from 'jsonwebtoken'
import { Iam } from 'src/models/iam'
import getStringEnv from 'src/utils/get-string-env'

const AUTH_ES256_PRIVATE_KEY = getStringEnv('AUTH_ES256_PRIVATE_KEY')

const auth = async (event: APIGatewayProxyEvent): Promise<Iam | undefined> => {
  const { Authorization } = event.headers

  if (!Authorization) {
    return
  }

  const token = Authorization.split(' ')[1]

  const private_key = AUTH_ES256_PRIVATE_KEY

  const options: VerifyOptions = {
    algorithms: ['ES256'],
  }

  try {
    const { user_type, sub: user_id } = jwt.verify(
      token,
      private_key,
      options,
    ) as JwtPayload

    return {
      principalId: user_id as string,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      context: {
        user_id,
        user_type,
      },
    }
  } catch {
    return {
      principalId: '',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
      context: {},
    }
  }
}

export default auth
