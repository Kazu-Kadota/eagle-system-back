import { APIGatewayProxyEvent } from 'aws-lambda'
import { defaultHeaders } from 'src/constants/headers'
import { Response } from 'src/models/lambda'
import catchError from 'src/utils/catch-error'

import recoveryPasswordController from './main'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<Response<any>> => {
  try {
    const result = await recoveryPasswordController(event)

    return {
      headers: defaultHeaders,
      statusCode: 200,
      body: JSON.stringify(result.body),
    }
  } catch (err: any) {
    return catchError(err)
  }
}
