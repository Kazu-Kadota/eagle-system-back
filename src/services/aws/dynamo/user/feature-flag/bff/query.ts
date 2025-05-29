import {
  AttributeValue,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { FeatureFlagBFF, FeatureFlagBFFKey } from 'src/models/dynamo/feature-flags/feature-flag-bff'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF')

export type QueryFeatureFlagBFFResponse <T extends FeatureFlagsEnum> = {
  last_evaluated_key?: Record<string, AttributeValue>
  feature_flag: FeatureFlagBFF<T>[]
}

const queryFeatureFlagBFF = async <T extends FeatureFlagsEnum> (
  query: Partial<FeatureFlagBFFKey>,
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<QueryFeatureFlagBFFResponse<T> | undefined> => {
  logger.debug({
    message: 'Querying feature flag BFF',
    ...query,
  })

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF,
    KeyConditionExpression: createConditionExpression(query, true),
    ExpressionAttributeNames: createExpressionAttributeNames(query),
    ExpressionAttributeValues: createExpressionAttributeValues(query),
    ExclusiveStartKey: last_evaluated_key,
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as FeatureFlagBFF<T>))

  if (LastEvaluatedKey) {
    last_evaluated_key = LastEvaluatedKey
  }

  return {
    last_evaluated_key,
    feature_flag: result,
  }
}

export default queryFeatureFlagBFF
