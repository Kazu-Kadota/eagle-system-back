import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { Controller } from 'src/models/lambda'
import getFeatureFlagBFF from 'src/services/aws/dynamo/user/feature-flag/bff/get'
import putFeatureFlagBFF from 'src/services/aws/dynamo/user/feature-flag/bff/put'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const setFeatureFlagBFFController: Controller = async (req) => {
  const body = validateBody(JSON.parse(req.body as string))

  const already_exist_feature_flag_bff: Array<FeatureFlagsEnum> = []
  const set_feature_flag_bff: Array<FeatureFlagsEnum> = []

  for (const item of body) {
    const feature_flag_bff = await getFeatureFlagBFF({
      feature_flag: item.feature_flag,
    }, dynamodbClient)

    if (feature_flag_bff) {
      already_exist_feature_flag_bff.push(item.feature_flag)
    } else {
      const feature_flag_bff_key = {
        feature_flag: item.feature_flag,
      }

      const feature_flag_bff_body = item.bff

      await putFeatureFlagBFF(feature_flag_bff_key, feature_flag_bff_body, dynamodbClient)

      set_feature_flag_bff.push(item.feature_flag)
    }
  }

  logger.info({
    message: 'Success on set feature flag bff',
    already_exist_feature_flag_bff,
    set_feature_flag_bff,
  })

  return {
    body: {
      message: 'Sucesso em cadastrar novo produto bff',
      already_exist_feature_flag_bff,
      set_feature_flag_bff,
    },
  }
}

export default setFeatureFlagBFFController
