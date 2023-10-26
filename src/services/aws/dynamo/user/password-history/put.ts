import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import {
  PasswordHistoryKey,
  PasswordHistoryBody,
  PasswordHistory,
} from 'src/models/dynamo/users/password-history'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_PASSWORD_HISTORY = getStringEnv('DYNAMO_TABLE_EAGLEUSER_PASSWORD_HISTORY')

const putPasswordHistory = async (
  key: PasswordHistoryKey,
  body: PasswordHistoryBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Putting update password event',
    user_id: key.user_id,
  })

  const now = new Date().toISOString()

  const password_history: PasswordHistory = {
    ...key,
    ...body,
    created_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_PASSWORD_HISTORY,
    Item: marshall(password_history),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putPasswordHistory
