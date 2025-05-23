import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlag } from 'src/models/dynamo/feature-flag'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG')

export interface ScanFeatureFlagResponse {
  result: FeatureFlag[],
  last_evaluated_key?: Record<string, AttributeValue>
}

export interface ExclusiveStartKey {
  value?: Record<string, AttributeValue>
}

const scanFeatureFlag = async (
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<ScanFeatureFlagResponse | undefined> => {
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

  const result = Items.map((item) => (unmarshall(item) as FeatureFlag))

  if (LastEvaluatedKey) {
    last_evaluated_key = LastEvaluatedKey
  }

  return {
    result,
    last_evaluated_key,
  }
}

export default scanFeatureFlag
