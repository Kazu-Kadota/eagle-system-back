import { APIGatewayProxyEvent } from 'aws-lambda'
import { Response } from 'src/models/lambda'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import deleteFeatureFlagController from './main'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<Response<any>> => {
  logger.setService('ealgeuser')

  const allowed_users: LambdaHandlerNameSpace.UserAuthentication = {
    admin: true,
    client: false,
    operator: false,
  }

  const controller = new LambdaHandlerNameSpace
    .LambdaHandlerFunction(deleteFeatureFlagController, allowed_users)

  return controller.handler(event)
}
