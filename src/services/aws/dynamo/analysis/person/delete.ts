import {
  DynamoDBClient,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { PersonKey } from 'src/models/dynamo/person'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE')

const deletePerson = async (
  key: PersonKey,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Deleting person from person',
    person_id: key.person_id,
    document: key.document,
  })

  const command = new DeleteItemCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE,
    Key: marshall(key),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, true),
  })

  await dynamodbClient.send(command)
}

export default deletePerson
