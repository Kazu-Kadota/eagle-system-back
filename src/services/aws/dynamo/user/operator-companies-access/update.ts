import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import {
  OperatorCompaniesAccess,
  OperatorCompaniesAccessBody,
  OperatorCompaniesAccessKey,
} from 'src/models/dynamo/users/operator-companies-access'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
  createUpdateExpression,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_USER = getStringEnv('DYNAMO_TABLE_EAGLEUSER_USER')

const updateOperatorCompaniesAccess = async (
  key: OperatorCompaniesAccessKey,
  body: Partial<OperatorCompaniesAccessBody>,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  const dynamoDocClient = DynamoDBDocumentClient.from(dynamodbClient)
  logger.debug({
    message: 'Updating operator companies access in table',
    user_id: key.user_id,
  })

  const now = new Date().toISOString()

  const update: Partial<OperatorCompaniesAccess> = {
    ...key,
    ...body,
    updated_at: now,
  }

  const command = new UpdateCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_USER,
    Key: key,
    ConditionExpression: createConditionExpression(key, true),
    ExpressionAttributeNames: createExpressionAttributeNames(update),
    ExpressionAttributeValues: createExpressionAttributeValues(update, true),
    UpdateExpression: createUpdateExpression(update, Object.keys(key)),
  })

  await dynamoDocClient.send(command)
}

export default updateOperatorCompaniesAccess
