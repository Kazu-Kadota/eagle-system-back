import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagBody, FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { Controller } from 'src/models/lambda'
import queryFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/query'
import transactWriteFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/transact-write'
import logger from 'src/utils/logger'

import removeEmpty from 'src/utils/remove-empty'

import validateBody from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const updateFeatureFlagController: Controller = async (req) => {
  const body = validateBody(JSON.parse(req.body as string))

  const current_company_feature_flags = await queryFeatureFlag({
    company_id: body.company_id,
  }, dynamodbClient)

  if (!current_company_feature_flags) {
    logger.info({
      message: 'There is no feature flag updated. Company do not have any feature flag set',
      company_id: body.company_id,
    })

    return {
      body: {
        message: 'Nenhum feature flag foi atualizado',
      },
    }
  }

  const current_company_feature_flags_names = current_company_feature_flags.feature_flag.map((value) => value.feature_flag)

  const change_company_feature_flags = body.feature_flags
    .map<FeatureFlagKey & FeatureFlagBody<FeatureFlagsEnum> | undefined>((value) => {
      return current_company_feature_flags_names.includes(value.feature_flag)
        ? {
            feature_flag: value.feature_flag,
            company_id: body.company_id,
            enabled: value.enabled,
            config: value.config,
          }
        : undefined
    })
    // @ts-ignore-next-line
    .filter<FeatureFlagKey & FeatureFlagBody<FeatureFlagsEnum>>((value) => value !== undefined)

  await transactWriteFeatureFlag({
    feature_flags: removeEmpty(change_company_feature_flags),
    operation: 'update',
    dynamodbClient,
  })

  logger.info({
    message: 'Success on update feature flag',
    feature_flags: change_company_feature_flags,
  })

  return {
    body: {
      message: 'Sucesso em atualizar o produto',
      feature_flags: change_company_feature_flags,
    },
  }
}

export default updateFeatureFlagController
