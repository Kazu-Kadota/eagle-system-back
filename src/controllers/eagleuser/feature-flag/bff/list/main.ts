import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Controller } from 'src/models/lambda'
import scanFeatureFlagBFF from 'src/services/aws/dynamo/user/feature-flag/bff/scan'
import logger from 'src/utils/logger'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const setFeatureFlagBFFController: Controller = async () => {
  const feature_flags_bff = await scanFeatureFlagBFF(dynamodbClient)

  logger.info({
    message: 'Success on scan feature flag bff',
  })

  return {
    body: {
      message: 'Sucesso em listar produtos bff',
      feature_flags_bff,
    },
  }
}

export default setFeatureFlagBFFController
