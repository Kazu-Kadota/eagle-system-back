import {
  DynamoDBClient,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS = getStringEnv('DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS')

const deleteOperatorCompaniesAccess = async (
  key: OperatorCompaniesAccessKey,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Deleting user from operator companies access',
    user_id: key.user_id,
  })

  const command = new DeleteItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS,
    Key: marshall(key),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, true),
  })

  await dynamodbClient.send(command)
}

export default deleteOperatorCompaniesAccess
