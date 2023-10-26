import {
  DynamoDBClient,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { PersonRequestKey } from 'src/models/dynamo/request-person'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON')

const deleteRequestPerson = async (
  key: PersonRequestKey,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Deleting person from request person',
    request_id: key.request_id,
    person_id: key.person_id,
  })

  const command = new DeleteItemCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON,
    Key: marshall(key),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, true),
  })

  await dynamodbClient.send(command)
}

export default deleteRequestPerson
