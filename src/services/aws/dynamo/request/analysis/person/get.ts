import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { PersonRequestKey, PersonRequest } from 'src/models/dynamo/request-person'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON')

const getRequestPerson = async (
  key: PersonRequestKey,
  dynamodbClient: DynamoDBClient,
): Promise<PersonRequest | undefined> => {
  logger.debug({
    message: 'Getting person by person id',
    person_id: key.person_id,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON,
    Key: marshall(key),
  })

  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as PersonRequest
}

export default getRequestPerson
