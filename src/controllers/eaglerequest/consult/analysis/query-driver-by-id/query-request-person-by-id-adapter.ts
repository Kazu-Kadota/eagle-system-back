import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PersonRequest } from 'src/models/dynamo/request-person'
import queryRequestPersonById, { QueryRequestPersonByIdQuery } from 'src/services/aws/dynamo/request/analysis/person/query-by-id'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

const queryRequestPersonByIdAdapter = async (
  person_id: string,
  user_info: UserInfoFromJwt,
  dynamodbClient: DynamoDBClient,
): Promise<PersonRequest> => {
  const query: QueryRequestPersonByIdQuery = {
    person_id,
  }
  const request_person = await queryRequestPersonById(query, dynamodbClient)

  if (!request_person || !request_person[0]) {
    logger.warn({
      message: 'Person not exist',
      person_id,
    })

    throw new ErrorHandler('Pessoa não existe', 404)
  }

  if (
    user_info.user_type === 'client'
    && user_info.company_name !== request_person[0].company_name
  ) {
    logger.warn({
      message: 'Person not requested to analyze from company',
      company_name: user_info,
      person_id,
    })

    throw new ErrorHandler('Pessoa não solicitada para análise pela empresa', 401)
  }

  logger.info({
    message: 'Finish on get person request info',
    person: request_person,
  })

  return request_person[0]
}

export default queryRequestPersonByIdAdapter
