import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PersonRequest, PersonRequestKey } from 'src/models/dynamo/request-person'
import getRequestPerson from 'src/services/aws/dynamo/request/analysis/person/get'
import getFinishedRequestPerson from 'src/services/aws/dynamo/request/finished/person/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

const getRequestPersonAdapter = async (
  key: PersonRequestKey,
  user_info: UserInfoFromJwt,
  dynamodbClient: DynamoDBClient,
): Promise<PersonRequest> => {
  const request_person = await getRequestPerson(key, dynamodbClient)

  if (request_person) {
    if (
      user_info.user_type === 'client'
      && user_info.company_name !== request_person.company_name
    ) {
      logger.warn({
        message: 'Person not requested to analyze from company',
        company_name: user_info,
        request_id: key.request_id,
        person_id: key.person_id,
      })

      throw new ErrorHandler('Requisição de análise não solicitada pela empresa', 401)
    }

    return request_person
  }

  const finished_person = await getFinishedRequestPerson(key, dynamodbClient)

  if (finished_person) {
    if (
      user_info.user_type === 'client'
      && user_info.company_name !== finished_person.company_name
    ) {
      logger.warn({
        message: 'Person not requested to analyze from company',
        company_name: user_info,
        request_id: key.request_id,
        person_id: key.person_id,
      })

      throw new ErrorHandler('Requisição de análise não solicitada pela empresa', 401)
    }

    return finished_person
  }

  logger.warn({
    message: 'Person not exist',
    request_id: key.request_id,
    person_id: key.person_id,
  })

  throw new ErrorHandler('Pessoa não existe', 404)
}

export default getRequestPersonAdapter
