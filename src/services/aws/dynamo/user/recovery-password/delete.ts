import {
  DynamoDBClient,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { RecoveryPasswordKey } from 'src/models/dynamo/users/recovery-password'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_RECOVERY_PASSWORD = getStringEnv('DYNAMO_TABLE_EAGLEUSER_RECOVERY_PASSWORD')

const deleteRecoveryPassword = async (
  key: RecoveryPasswordKey,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Deleting recovery password from id',
    recovery_id: key.recovery_id,
  })

  const command = new DeleteItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_RECOVERY_PASSWORD,
    Key: marshall(key),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, true),
  })

  await dynamodbClient.send(command)
}

export default deleteRecoveryPassword
