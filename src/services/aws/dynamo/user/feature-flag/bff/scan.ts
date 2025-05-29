import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { FeatureFlagBFF } from 'src/models/dynamo/feature-flags/feature-flag-bff'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF')

export type ScanFeatureFlagBFFResponse <T extends FeatureFlagsEnum> = {
  result: FeatureFlagBFF<T>[],
  last_evaluated_key?: Record<string, AttributeValue>
}

const scanFeatureFlagBFF = async <T extends FeatureFlagsEnum = any> (
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<ScanFeatureFlagBFFResponse<T> | undefined> => {
  logger.debug({
    message: 'Scanning feature flag BFF',
  })

  const command = new ScanCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF,
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
    result,
    last_evaluated_key,
  }
}

export default scanFeatureFlagBFF
