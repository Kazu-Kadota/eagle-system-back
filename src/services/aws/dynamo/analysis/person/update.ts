import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { Person, PersonBody, PersonKey } from 'src/models/dynamo/person'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
  createUpdateExpression,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE')

const updatePerson = async (
  key: PersonKey,
  body: Partial<PersonBody>,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  const dynamoDocClient = DynamoDBDocumentClient.from(dynamodbClient)
  logger.debug({
    message: 'Updating person info',
    person_id: key.person_id,
    document: key.document,
  })

  const now = new Date().toISOString()

  const update: Partial<Person> = {
    ...key,
    ...body,
    updated_at: now,
  }

  const command = new UpdateCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE,
    Key: key,
    UpdateExpression: createUpdateExpression(update, Object.keys(key)),
    ExpressionAttributeNames: createExpressionAttributeNames(update),
    ExpressionAttributeValues: createExpressionAttributeValues(update, true),
    ConditionExpression: createConditionExpression(key, true),
  })

  await dynamoDocClient.send(command)
}

export default updatePerson
