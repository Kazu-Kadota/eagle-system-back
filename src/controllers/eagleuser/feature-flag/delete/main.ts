import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Controller } from 'src/models/lambda'
import transactWriteFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/transact-write'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const deleteFeatureFlagController: Controller = async (req) => {
  const body = validateBody(JSON.parse(req.body as string))

  await transactWriteFeatureFlag({
    dynamodbClient,
    operation: 'delete',
    feature_flags: body.feature_flag.map((item) => {
      return {
        company_id: body.company_id,
        feature_flag: item,
      }
    }),
  })

  logger.info({
    message: 'Success in delete feature flags',
    ...body,
  })

  return {
    body: {
      message: 'Sucesso em deletar produtos',
      ...body,
    },
  }
}

export default deleteFeatureFlagController
