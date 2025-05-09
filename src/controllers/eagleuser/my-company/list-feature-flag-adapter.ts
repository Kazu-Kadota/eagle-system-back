import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import queryFeatureFlag, { QueryByCompanyId, QueryByCompanyIdResponse } from 'src/services/aws/dynamo/user/feature-flag/query'

export type ListFeatureFlagAdapterParams = {
  company_id: string
  dynamodbClient: DynamoDBClient
}

const listFeatureFlagAdapter = async ({
  company_id,
  dynamodbClient,
}: ListFeatureFlagAdapterParams): Promise<Array<FeatureFlagsEnum>> => {
  const result: Array<FeatureFlagsEnum> = []
  let last_evaluated_key

  const query_by_company_id_params: QueryByCompanyId = {
    company_id,
  }

  do {
    const list_feature_flag: QueryByCompanyIdResponse<FeatureFlagsEnum> | undefined = await queryFeatureFlag<FeatureFlagsEnum>(
      query_by_company_id_params,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!list_feature_flag) {
      break
    }

    for (const item of list_feature_flag.feature_flag) {
      if (item.enabled) {
        result.push(item.feature_flag)
      }
    }

    last_evaluated_key = list_feature_flag?.last_evaluated_key
  } while (last_evaluated_key)

  return result
}

export default listFeatureFlagAdapter
