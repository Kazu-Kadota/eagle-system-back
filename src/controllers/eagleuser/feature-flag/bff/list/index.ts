import { APIGatewayProxyEvent } from 'aws-lambda'
import { Response } from 'src/models/lambda'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import setFeatureFlagBFFController from './main'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<Response<any>> => {
  logger.setService('eagleuser')

  const allowed_users: LambdaHandlerNameSpace.UserAuthentication = {
    admin: true,
    client: false,
    operator: false,
  }

  const controller = new LambdaHandlerNameSpace
    .LambdaHandlerFunction(setFeatureFlagBFFController, allowed_users)

  return controller.handler(event)
}
