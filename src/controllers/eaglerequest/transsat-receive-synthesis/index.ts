import { APIGatewayProxyEvent } from 'aws-lambda'
import { Response } from 'src/models/lambda'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import transsatReceiveSynthesisController from './main'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<Response<any>> => {
  logger.setService('eaglerequest')

  const controller = new LambdaHandlerNameSpace
    .LambdaApiKeyHandlerFunction(transsatReceiveSynthesisController)

  return controller.handler(event)
}
