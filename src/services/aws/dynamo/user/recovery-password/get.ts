import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { RecoveryPasswordKey, RecoveryPassword } from 'src/models/dynamo/users/recovery-password'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_RECOVERY_PASSWORD = getStringEnv('DYNAMO_TABLE_EAGLEUSER_RECOVERY_PASSWORD')

const getRecoveryPassword = async (
  key: RecoveryPasswordKey,
  dynamodbClient: DynamoDBClient,
): Promise<RecoveryPassword | undefined> => {
  logger.debug({
    message: 'Getting recovery password by id',
    recovery_id: key.recovery_id,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_RECOVERY_PASSWORD,
    Key: marshall(key),
  })
  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as RecoveryPassword
}

export default getRecoveryPassword
