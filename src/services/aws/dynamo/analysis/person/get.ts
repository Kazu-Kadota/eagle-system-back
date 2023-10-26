import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { Person, PersonKey } from 'src/models/dynamo/person'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE')

const getPerson = async (
  key: PersonKey,
  dynamodbClient: DynamoDBClient,
): Promise<Person | undefined> => {
  logger.debug({
    message: 'Getting person by person id',
    person_id: key.person_id,
    document: key.document,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_PEOPLE,
    Key: marshall(key),
  })
  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as Person
}

export default getPerson
