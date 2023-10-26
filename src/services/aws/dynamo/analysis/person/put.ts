import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Person, PersonBody, PersonKey } from 'src/models/dynamo/person'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE')

const putPerson = async (
  key: PersonKey,
  data: PersonBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Registering person into table',
    person_id: key.person_id,
    document: key.document,
  })

  const now = new Date().toISOString()

  const put: Person = {
    ...key,
    ...data,
    created_at: now,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE,
    Item: marshall(put),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putPerson
