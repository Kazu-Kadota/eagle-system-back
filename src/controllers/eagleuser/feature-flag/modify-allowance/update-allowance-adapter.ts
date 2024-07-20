import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagBody, FeatureFlagKey } from 'src/models/dynamo/feature-flag'
import updateFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/update'

import { FeatureFlagValidate } from './validate-body'

const updateAllowanceAdapter = async (body: FeatureFlagValidate, dynamodbClient: DynamoDBClient): Promise<void> => {
  const feature_flag_key: FeatureFlagKey = {
    company_id: body.company_id,
    feature_flag: body.feature_flag,
  }

  const feature_flag_body: Partial<FeatureFlagBody> = {
    enabled: body.enabled,
  }

  await updateFeatureFlag(feature_flag_key, feature_flag_body, dynamodbClient)
}

export default updateAllowanceAdapter
