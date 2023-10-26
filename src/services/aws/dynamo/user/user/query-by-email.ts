import {
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { User } from 'src/models/dynamo/user'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_USER = getStringEnv('DYNAMO_TABLE_EAGLEUSER_USER')

export interface QueryByEmailQuery {
  email: string
}

const queryByEmail = async (
  query: QueryByEmailQuery,
  dynamodbClient: DynamoDBClient,
): Promise<User[] | undefined> => {
  logger.debug({
    message: 'Querying user by email',
    email: query.email,
  })

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_USER,
    IndexName: 'email-index',
    KeyConditionExpression: createConditionExpression(query, true),
    ExpressionAttributeNames: createExpressionAttributeNames(query),
    ExpressionAttributeValues: createExpressionAttributeValues(query),
  })

  const { Items } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as User))

  return result
}

export default queryByEmail
