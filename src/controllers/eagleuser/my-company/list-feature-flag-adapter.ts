import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import scanFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/scan'

export type ListFeatureFlagAdapterResponse = Array<string>

const listFeatureFlagAdapter = async (
  dynamodbClient: DynamoDBClient,
): Promise<ListFeatureFlagAdapterResponse> => {
  const result = []
  let last_evaluated_key

  do {
    const list_feature_flag = await scanFeatureFlag(
      dynamodbClient,
      last_evaluated_key,
    )

    if (!list_feature_flag) {
      break
    }

    for (const item of list_feature_flag.result) {
      if (item.enabled) {
        result.push(item.feature_flag)
      }
    }

    last_evaluated_key = list_feature_flag?.last_evaluated_key
  } while (last_evaluated_key)

  return result
}

export default listFeatureFlagAdapter
