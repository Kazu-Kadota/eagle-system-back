import { APIGatewayProxyEvent } from 'aws-lambda'
import { defaultHeaders } from 'src/constants/headers'
import { Response } from 'src/models/lambda'
import catchError from 'src/utils/catch-error'
import ErrorHandler from 'src/utils/error-handler'
import extractJwtLambda from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import registerUser from './main'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<Response<any>> => {
  try {
    const user_info = extractJwtLambda(event)

    if (!user_info) {
      throw new ErrorHandler('Usuário não autenticado', 403)
    }

    if (user_info.user_type !== 'admin') {
      throw new ErrorHandler('Usuário não autorizado para criar novos usuários', 401)
    }

    logger.debug({
      message: 'Start register user path',
      user_info,
    })

    const result = await registerUser(event)

    return {
      headers: defaultHeaders,
      statusCode: 200,
      body: JSON.stringify(result.body),
    }
  } catch (err: any) {
    return catchError(err)
  }
}
