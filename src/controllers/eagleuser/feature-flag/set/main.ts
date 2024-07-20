import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ReturnResponse } from 'src/models/lambda'
import logger from 'src/utils/logger'

import { APIGatewayProxyEvent } from 'aws-lambda'
import validateBody from './validate-body'
import setFeatureFlagAdapter from './set-feature-flag-adapter'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const setFeatureFlagHandler = async (event: APIGatewayProxyEvent): Promise<ReturnResponse<any>> => {
  logger.debug({
    message: 'Request to set feature flag',
  })

  const body = validateBody(JSON.parse(event.body as string))

  await setFeatureFlagAdapter(body, dynamodbClient)

  logger.info({
    message: 'Success on set feature flag',
    company_id: body.company_id,
    feature_flag: body.feature_flag,
    enabled: body.enabled
  })

  return {
    body: {
      message: 'Success on set feature flag',
    }
  }
}

export default setFeatureFlagHandler
