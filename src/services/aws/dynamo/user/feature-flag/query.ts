import {
  AttributeValue,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlag, FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG')

export type QueryByCompanyIdResponse <T extends FeatureFlagsEnum> = {
  last_evaluated_key?: Record<string, AttributeValue>
  feature_flag: FeatureFlag<T>[]
}

export type QueryByCompanyId = {
  company_id: string
}

const queryFeatureFlag = async <T extends FeatureFlagsEnum> (
  query: Partial<FeatureFlagKey>,
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<QueryByCompanyIdResponse<T> | undefined> => {
  logger.debug({
    message: 'Querying feature flag by company_id',
    ...query,
  })

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG,
    KeyConditionExpression: createConditionExpression(query, true),
    ExpressionAttributeNames: createExpressionAttributeNames(query),
    ExpressionAttributeValues: createExpressionAttributeValues(query),
    ExclusiveStartKey: last_evaluated_key,
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as FeatureFlag<T>))

  if (LastEvaluatedKey) {
    last_evaluated_key = LastEvaluatedKey
  }

  return {
    last_evaluated_key,
    feature_flag: result,
  }
}

export default queryFeatureFlag
