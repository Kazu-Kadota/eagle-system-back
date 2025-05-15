import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Controller } from 'src/models/lambda'
import deleteFeatureFlagBFF from 'src/services/aws/dynamo/user/feature-flag/bff/delete'
import getFeatureFlagBFF from 'src/services/aws/dynamo/user/feature-flag/bff/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

// Not in use. Definition is done directly in DB
const updateFeatureFlagBFFController: Controller = async (req) => {
  const body = validateBody(JSON.parse(req.body as string))

  const feature_flag_bff = await getFeatureFlagBFF({
    feature_flag: body.feature_flag,
  }, dynamodbClient)

  if (!feature_flag_bff) {
    logger.warn({
      message: 'Feature flag bff do not exist',
      feature_flag: body.feature_flag,
    })

    throw new ErrorHandler('Não existe bff deste produto', 404, [body.feature_flag])
  }

  const feature_flag_bff_key = {
    feature_flag: body.feature_flag,
  }

  await deleteFeatureFlagBFF(feature_flag_bff_key, dynamodbClient)

  logger.info({
    message: 'Success on delete feature flag bff',
    ...body,
  })

  return {
    body: {
      message: 'Sucesso em excluir produto bff',
      ...body,
    },
  }
}

export default updateFeatureFlagBFFController
