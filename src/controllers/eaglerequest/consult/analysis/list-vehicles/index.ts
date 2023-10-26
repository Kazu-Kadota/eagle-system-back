import { APIGatewayProxyEvent } from 'aws-lambda'
import { defaultHeaders } from 'src/constants/headers'
import { Response } from 'src/models/lambda'
import catchError from 'src/utils/catch-error'
import ErrorHandler from 'src/utils/error-handler'
import extractJwtLambda from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import requestVehicles from './main'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<Response<any>> => {
  try {
    const user_info = extractJwtLambda(event)

    if (!user_info) {
      throw new ErrorHandler('Usuário não autenticado', 403)
    }

    logger.debug({
      message: 'Start list vehicles',
      user_info,
    })

    const result = await requestVehicles(user_info)

    return {
      headers: defaultHeaders,
      statusCode: 200,
      body: JSON.stringify(result.body),
    }
  } catch (err: any) {
    return catchError(err)
  }
}
