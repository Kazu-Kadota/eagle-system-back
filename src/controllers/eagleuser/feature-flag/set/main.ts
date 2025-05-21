import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagBody, FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { Controller } from 'src/models/lambda'
import queryFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/query'
import transactWriteFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/transact-write'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const setFeatureFlagController: Controller = async (req) => {
  const body = validateBody(JSON.parse(req.body as string))

  const current_company_feature_flags = await queryFeatureFlag({
    company_id: body.company_id,
  }, dynamodbClient)

  let change_company_feature_flags: Array<FeatureFlagKey & FeatureFlagBody<FeatureFlagsEnum>>

  if (!current_company_feature_flags) {
    change_company_feature_flags = body.feature_flags.map((value) => ({
      feature_flag: value.feature_flag,
      company_id: body.company_id,
      enabled: value.enabled,
      config: value.config,
    }))

    await transactWriteFeatureFlag({
      feature_flags: change_company_feature_flags,
      operation: 'put',
      dynamodbClient,
    })
  } else {
    const current_company_feature_flags_names = current_company_feature_flags.feature_flag.map((value) => value.feature_flag)

    change_company_feature_flags = body.feature_flags
      .map<FeatureFlagKey & FeatureFlagBody<FeatureFlagsEnum> | undefined>((value) => {
        return current_company_feature_flags_names.includes(value.feature_flag)
          ? undefined
          : {
              feature_flag: value.feature_flag,
              company_id: body.company_id,
              enabled: value.enabled,
              config: value.config,
            }
      })
      // @ts-ignore-next-line
      .filter<FeatureFlagKey & FeatureFlagBody<FeatureFlagsEnum>>((value) => value !== undefined)

    await transactWriteFeatureFlag({
      feature_flags: change_company_feature_flags,
      operation: 'put',
      dynamodbClient,
    })
  }

  logger.info({
    message: 'Success on set feature flag',
    feature_flags: change_company_feature_flags,
  })

  return {
    body: {
      message: 'Sucesso em cadastrar novo produto',
    },
  }
}

export default setFeatureFlagController
