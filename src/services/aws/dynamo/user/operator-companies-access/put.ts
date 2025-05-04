import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import {
  OperatorCompaniesAccess,
  OperatorCompaniesAccessBody,
  OperatorCompaniesAccessKey,
} from 'src/models/dynamo/users/operator-companies-access'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS = getStringEnv('DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS')

const putOperatorCompaniesAccess = async (
  key: OperatorCompaniesAccessKey,
  body: OperatorCompaniesAccessBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Putting operator companies access in table',
    user_id: key.user_id,
  })

  const now = new Date().toISOString()

  const operator: OperatorCompaniesAccess = {
    ...key,
    ...body,
    created_at: now,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS,
    Item: marshall(operator),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putOperatorCompaniesAccess
