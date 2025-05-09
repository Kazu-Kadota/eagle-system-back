import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlag, FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { Controller } from 'src/models/lambda'
import queryFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/query'
import logger from 'src/utils/logger'

import validateQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const listFeatureFlagController: Controller = async (req) => {
  const query = validateQuery({ ...req.queryStringParameters })

  const query_key: Partial<FeatureFlagKey> = {
    company_id: query.company_id,
    feature_flag: query.feature_flag,
  }

  const query_feature_flags = await queryFeatureFlag(query_key, dynamodbClient)

  if (!query_feature_flags) {
    logger.warn({
      message: 'There is no company with configuration in feature flag',
      ...query_key,
    })

    return {
      body: {
        message: 'Empresa não há configuração de produto',
        ...query_key,
      },
    }
  }

  const feature_flags = query_feature_flags.feature_flag
    .map<FeatureFlag<FeatureFlagsEnum> | undefined>((value) => value.enabled ? value : undefined)
    .filter((value): value is FeatureFlag<FeatureFlagsEnum> => value !== undefined)
    .sort(
      (r1, r2) => r1.feature_flag > r2.feature_flag
        ? 1
        : r1.feature_flag < r2.feature_flag
          ? -1
          : 0,
    )

  logger.info({
    message: 'Success in get feature flag',
    ...query_key,
  })

  return {
    body: {
      message: 'Sucesso em pegar produtos',
      feature_flags,
    },
  }
}

export default listFeatureFlagController
