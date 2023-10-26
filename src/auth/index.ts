import { APIGatewayProxyEvent } from 'aws-lambda'

import auth from './main'

export const handler = async (
  event: APIGatewayProxyEvent,
) => {
  const result = await auth(event)

  return result
}
