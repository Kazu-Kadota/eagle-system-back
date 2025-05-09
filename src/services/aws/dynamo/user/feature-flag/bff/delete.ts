import {
  DynamoDBClient,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlagBFFKey } from 'src/models/dynamo/feature-flags/feature-flag-bff'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF')

const deleteFeatureFlagBFF = async (
  key: FeatureFlagBFFKey,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Deleting feature flag bff',
    ...key,
  })

  const command = new DeleteItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF,
    Key: marshall(key),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, true),
  })

  await dynamodbClient.send(command)
}

export default deleteFeatureFlagBFF
