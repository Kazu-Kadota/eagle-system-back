import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { AccessToken } from 'src/models/dynamo/access-token'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_ACCESS_TOKEN = getStringEnv('DYNAMO_TABLE_EAGLEUSER_ACCESS_TOKEN')

const createAccessToken = async (
  data: AccessToken,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Creating access token',
    data,
  })
  const command = new PutItemCommand({
    Item: marshall({
      ...data,
    }),
    TableName: DYNAMO_TABLE_EAGLEUSER_ACCESS_TOKEN,
  })

  await dynamodbClient.send(command)
}

export default createAccessToken
