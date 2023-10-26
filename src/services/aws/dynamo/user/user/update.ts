import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { UserBody, UserKey } from 'src/models/dynamo/user'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
  createUpdateExpression,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_USER = getStringEnv('DYNAMO_TABLE_EAGLEUSER_USER')

const updateUser = async (
  key: UserKey,
  body: Partial<UserBody>,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  const dynamoDocClient = DynamoDBDocumentClient.from(dynamodbClient)
  logger.debug({
    message: 'Updating user in table',
    user_id: key.user_id,
  })

  const now = new Date().toISOString()

  const update = {
    ...key,
    ...body,
    updated_at: now,
  }

  const command = new UpdateCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_USER,
    Key: key,
    ConditionExpression: createConditionExpression(key, true),
    ExpressionAttributeNames: createExpressionAttributeNames(update),
    ExpressionAttributeValues: createExpressionAttributeValues(update, true),
    UpdateExpression: createUpdateExpression(update, Object.keys(key)),
  })

  await dynamoDocClient.send(command)
}

export default updateUser
