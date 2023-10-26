import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import {
  PersonRequestKey,
  PersonRequest,
} from 'src/models/dynamo/request-person'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON')

const putFinishedRequestPerson = async (
  key: PersonRequestKey,
  body: PersonRequest,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Registering finished request person',
    analysis_type: body.analysis_type,
    name: body.name,
    company_name: body.company_name,
  })

  const now = new Date().toISOString()

  const put: PersonRequest = {
    ...key,
    ...body,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON,
    Item: marshall(put),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putFinishedRequestPerson
