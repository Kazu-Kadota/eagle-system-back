import { APIGatewayProxyEvent } from 'aws-lambda'
import { Response } from 'src/models/lambda'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import updateFeatureFlagController from './main'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<Response<any>> => {
  logger.setService('ealeuser')

  const allowed_users: LambdaHandlerNameSpace.UserAuthentication = {
    admin: true,
    client: false,
    operator: false,
  }

  const controller = new LambdaHandlerNameSpace
    .LambdaHandlerFunction(updateFeatureFlagController, allowed_users)

  return controller.handler(event)
}
