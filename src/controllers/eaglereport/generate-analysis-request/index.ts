import { APIGatewayProxyEvent } from 'aws-lambda'
import { defaultHeaders } from 'src/constants/headers'
import { Response } from 'src/models/lambda'
import catchError from 'src/utils/catch-error'
import ErrorHandler from 'src/utils/error-handler'
import extractJwtLambda from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import reportAnalysis from './main'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<Response<any>> => {
  try {
    const user_info = extractJwtLambda(event)

    if (!user_info) {
      throw new ErrorHandler('Usuário não authenticado', 403)
    }

    if (user_info.user_type === 'operator') {
      throw new ErrorHandler('Usuário não autorizado para solicitar relatório', 401)
    }

    logger.debug({
      message: 'Start request report path',
      user_info,
    })
    const result = await reportAnalysis(event, user_info)

    return {
      headers: {
        ...defaultHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${result.body.path}_report_${new Date().toISOString().split('T')[0]}.csv`,
      },
      statusCode: 200,
      body: result.body.csv,
    }
  } catch (err: any) {
    return catchError(err)
  }
}
