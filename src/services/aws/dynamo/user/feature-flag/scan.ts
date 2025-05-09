import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlag, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG')

export type ScanFeatureFlagResponse <T extends FeatureFlagsEnum> = {
  result: FeatureFlag<T>[],
  last_evaluated_key?: Record<string, AttributeValue>
}

const scanFeatureFlag = async <T extends FeatureFlagsEnum = any> (
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<ScanFeatureFlagResponse<T> | undefined> => {
  logger.debug({
    message: 'Scanning feature flag',
  })

  const command = new ScanCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG,
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
    result,
    last_evaluated_key,
  }
}

export default scanFeatureFlag
