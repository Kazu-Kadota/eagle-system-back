import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import logger from 'src/utils/logger'

import updateAllowanceAdapter from './update-allowance-adapter'
import validateBody from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const modifyAllowanceFeatureFlagHandler = async (event: APIGatewayProxyEvent): Promise<ReturnResponse<any>> => {
  logger.debug({
    message: 'Request to modify allowance of feature flag',
  })

  const body = validateBody(JSON.parse(event.body as string))

  await updateAllowanceAdapter(body, dynamodbClient)

  logger.info({
    message: 'Success on modify allowance of feature flag',
    company_id: body.company_id,
    feature_flag: body.feature_flag,
    enabled: body.enabled,
  })

  return {
    body: {
      message: 'Success on modify allowance of feature flag',
    },
  }
}

export default modifyAllowanceFeatureFlagHandler
