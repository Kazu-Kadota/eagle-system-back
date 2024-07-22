import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlagBody, FeatureFlagKey } from 'src/models/dynamo/feature-flag'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG')

const putFeatureFlag = async (
  key: FeatureFlagKey,
  body: FeatureFlagBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Putting feature flag in table',
    company_id: key.company_id,
    feature_flag: key.feature_flag,
  })

  const now = new Date().toISOString()

  const feature_flag = {
    ...key,
    ...body,
    created_at: now,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG,
    Item: marshall(feature_flag),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putFeatureFlag
