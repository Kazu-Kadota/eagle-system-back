import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlag, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import getFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const getFeatureFlagAdapter = async (
  company_id: string,
  dynamodbClient: DynamoDBClient,
): Promise<FeatureFlag<FeatureFlagsEnum.SYNTHESIS_INFORMATION_ACCESS>> => {
  const feature_flag = await getFeatureFlag<FeatureFlagsEnum.SYNTHESIS_INFORMATION_ACCESS>({
    company_id,
    feature_flag: FeatureFlagsEnum.SYNTHESIS_INFORMATION_ACCESS,
  }, dynamodbClient)

  if (!feature_flag) {
    logger.warn({
      message: 'Feature flag not set',
      company_id,
      feature_flag: FeatureFlagsEnum.SYNTHESIS_INFORMATION_ACCESS,
    })

    throw new ErrorHandler('Feature flag not set', 404)
  }

  return feature_flag
}

export default getFeatureFlagAdapter
