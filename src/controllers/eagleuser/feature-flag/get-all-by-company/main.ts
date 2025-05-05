import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda'
import { Controller } from 'src/models/lambda'
import queryFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/query-by-company-id'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const getAllByCompanyFeatureFlagController: Controller = async (req) => {
  const query = req.queryStringParameters

  const body = validateBody(query as APIGatewayProxyEventQueryStringParameters)

  const feature_flags = await queryFeatureFlag(body, dynamodbClient)

  const allowed_feature_flags = feature_flags?.feature_flag.map((value) => value.enabled ? value.feature_flag : undefined).filter((value) => value !== undefined)

  logger.info({
    message: 'Success on get all feature flags',
    company_id: body.company_id,
  })

  return {
    body: {
      message: 'Success on get all feature flags',
      feature_flags: allowed_feature_flags,
    },
  }
}

export default getAllByCompanyFeatureFlagController
