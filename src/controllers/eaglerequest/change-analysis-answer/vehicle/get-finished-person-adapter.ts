import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PersonRequest, PersonRequestKey } from 'src/models/dynamo/request-person'
import getFinishedRequestPerson from 'src/services/aws/dynamo/request/finished/person/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const getFinishedPersonAdapter = async (
  key: PersonRequestKey,
  dynamodbClient: DynamoDBClient,
): Promise<PersonRequest> => {
  const finished_person = await getFinishedRequestPerson(key, dynamodbClient)

  if (!finished_person) {
    logger.warn({
      message: 'Person not exist',
      request_id: key.request_id,
      person_id: key.person_id,
    })

    throw new ErrorHandler('Pessoa não existe', 500)
  }

  return finished_person
}

export default getFinishedPersonAdapter
