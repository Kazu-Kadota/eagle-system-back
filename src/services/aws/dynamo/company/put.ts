import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Company, CompanyBody, CompanyKey } from 'src/models/dynamo/company'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import { v4 as uuid } from 'uuid'

const DYNAMO_TABLE_EAGLEUSER_COMPANY = getStringEnv('DYNAMO_TABLE_EAGLEUSER_COMPANY')

const putCompany = async (
  body: CompanyBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Registering company in table',
    company: body.cnpj,
  })

  const now = new Date().toISOString()

  const key: CompanyKey = {
    company_id: uuid(),
  }

  const put: Company = {
    ...key,
    ...body,
    created_at: now,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_COMPANY,
    Item: marshall(put),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putCompany
