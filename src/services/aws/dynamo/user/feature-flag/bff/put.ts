import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import {
  FeatureFlagBFF,
  FeatureFlagBFFBody,
  FeatureFlagBFFKey,
} from 'src/models/dynamo/feature-flags/feature-flag-bff'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF')

const putFeatureFlagBFF = async <T extends FeatureFlagsEnum> (
  key: FeatureFlagBFFKey,
  body: FeatureFlagBFFBody<T>,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Putting feature flag in table',
    ...key,
  })

  const now = new Date().toISOString()

  const feature_flag: FeatureFlagBFF<T> = {
    ...key,
    ...body,
    created_at: now,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF,
    Item: marshall(feature_flag),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putFeatureFlagBFF
