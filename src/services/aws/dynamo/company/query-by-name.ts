import {
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { Company } from 'src/models/dynamo/company'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_COMPANY = getStringEnv('DYNAMO_TABLE_EAGLEUSER_COMPANY')

const queryCompanyByName = async (
  name: string,
  dynamodbClient: DynamoDBClient,
): Promise<Company[] | undefined> => {
  logger.debug({
    message: 'Querying company by name',
    name,
  })

  const key = {
    name,
  }

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_COMPANY,
    IndexName: 'name-index',
    KeyConditionExpression: createConditionExpression(key, true),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
  })
  const { Items } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as Company))

  return result
}

export default queryCompanyByName
