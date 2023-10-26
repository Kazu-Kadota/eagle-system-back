import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { User, UserKey } from 'src/models/dynamo/user'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_USER = getStringEnv('DYNAMO_TABLE_EAGLEUSER_USER')

const getUser = async (
  key: UserKey,
  dynamodbClient: DynamoDBClient,
): Promise<User | undefined> => {
  logger.debug({
    message: 'Getting user by user id',
    user_id: key.user_id,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_USER,
    Key: marshall(key),
  })
  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as User
}

export default getUser
