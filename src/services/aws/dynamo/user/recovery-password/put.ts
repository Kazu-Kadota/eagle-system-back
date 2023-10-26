import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { RecoveryPasswordBody, RecoveryPasswordKey } from 'src/models/dynamo/users/recovery-password'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_RECOVERY_PASSWORD = getStringEnv('DYNAMO_TABLE_EAGLEUSER_RECOVERY_PASSWORD')

const putRecoveryPassword = async (
  key: RecoveryPasswordKey,
  body: RecoveryPasswordBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Putting recovery key in table',
    user_id: body.user_id,
  })

  const recovery_password = {
    ...key,
    ...body,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_RECOVERY_PASSWORD,
    Item: marshall(recovery_password),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putRecoveryPassword
