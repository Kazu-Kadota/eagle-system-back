import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { defaultHeaders } from 'src/constants/headers'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { Controller, Request } from 'src/models/lambda'

import catchError from '../catch-error'
import ErrorHandler from '../error-handler'
import extractJwtLambda from '../extract-jwt-lambda'
import logger from '../logger'

namespace LambdaHandlerNameSpace {
  export interface UserAuthentication extends Record<UserGroupEnum, boolean> {}

  export class LambdaHandlerFunction {
    controller: Controller
    authentication?: UserAuthentication

    constructor (controller: Controller, authentication?: UserAuthentication) {
      this.controller = controller
      this.authentication = authentication
    }

    async handler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
      try {
        logger.setRequestId(event.requestContext.requestId)

        const request: Request = {
          ...event,
        }

        if (this.authentication) {
          const user_info = extractJwtLambda(event)

          if (!user_info) {
            logger.error({
              message: 'User not authenticated',
            })

            throw new ErrorHandler('Usuário não autenticado', 403)
          }

          logger.setUser(user_info?.user_id)

          if (!this.authentication[user_info.user_type]) {
            logger.error({
              message: 'User not authorized to execute this function',
              user_type: user_info.user_type,
            })

            throw new ErrorHandler('Usuário não autorizado para executar este fluxo', 401)
          }

          request.user_info = user_info
        }

        const result = await this.controller(request)

        return {
          headers: {
            ...defaultHeaders,
            ...result.headers,
          },
          multiValueHeaders: result.multiValueHeaders,
          statusCode: result.statusCode ?? 200,
          body: result.notJsonBody === true ? result.body : JSON.stringify(result.body),
          isBase64Encoded: result.isBase64Encoded,
        }
      } catch (err: any) {
        return catchError(err)
      }
    }
  }
}

export default LambdaHandlerNameSpace
