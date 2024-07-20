import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagBody, FeatureFlagKey } from 'src/models/dynamo/feature-flag'
import putFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/put'

import { FeatureFlagValidate } from './validate-body'

const setFeatureFlagAdapter = async (body: FeatureFlagValidate, dynamodbClient: DynamoDBClient): Promise<void> => {
  const feature_flag_key: FeatureFlagKey = {
    company_id: body.company_id,
    feature_flag: body.feature_flag,
  }

  const feature_flag_body: FeatureFlagBody = {
    enabled: body.enabled,
  }

  await putFeatureFlag(feature_flag_key, feature_flag_body, dynamodbClient)
}

export default setFeatureFlagAdapter
