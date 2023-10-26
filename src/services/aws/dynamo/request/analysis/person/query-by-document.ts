import {
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { PersonRequest } from 'src/models/dynamo/request-person'
import {
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON')

export interface QueryRequestPersonByDocumentQuery {
  document: string
  company_name?: string
}

const queryRequestPersonByDocument = async (
  query: QueryRequestPersonByDocumentQuery,
  dynamodbClient: DynamoDBClient,
): Promise<PersonRequest[] | undefined> => {
  logger.debug({
    message: 'Querying request person by document',
    document: query.document,
  })

  let filterExpression

  if (query.company_name) {
    filterExpression = '#company_name = :company_name'
  }

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON,
    IndexName: 'document-index',
    KeyConditionExpression: '#document = :document',
    ExpressionAttributeNames: createExpressionAttributeNames(query),
    ExpressionAttributeValues: createExpressionAttributeValues(query),
    FilterExpression: filterExpression,
  })

  const { Items } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as PersonRequest))

  return result
}

export default queryRequestPersonByDocument
