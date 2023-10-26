import {
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { Person } from 'src/models/dynamo/person'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE')

const queryPersonByDocument = async (
  document: string,
  dynamodbClient: DynamoDBClient,
): Promise<Person[] | undefined> => {
  logger.debug({
    message: 'Querying person by document',
    document,
  })

  const key = {
    document,
  }

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE,
    IndexName: 'document-index',
    KeyConditionExpression: createConditionExpression(key, true),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
  })
  const { Items } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as Person))

  return result
}

export default queryPersonByDocument
