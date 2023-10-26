import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PersonRequest } from 'src/models/dynamo/request-person'
import queryRequestPersonByDocument from 'src/services/aws/dynamo/request/analysis/person/query-by-document'
import queryFinishedRequestPersonByDocument from 'src/services/aws/dynamo/request/finished/person/query-by-document'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import { RequestPersonByDocumentQuery } from './validate-query-person'

const queryRequestPersonByDocumentAdapter = async (
  query_person: RequestPersonByDocumentQuery,
  dynamodbClient: DynamoDBClient,
  user_info: UserInfoFromJwt,
): Promise<PersonRequest[]> => {
  logger.debug({
    message: 'Requested query person by document',
    plate: query_person.document,
  })

  const pending_analysis = await queryRequestPersonByDocument(
    query_person,
    dynamodbClient,
  )

  const finished_analysis = await queryFinishedRequestPersonByDocument(
    query_person,
    dynamodbClient,
  )

  if ((!pending_analysis || !pending_analysis[0]) && (!finished_analysis || !finished_analysis[0])) {
    logger.warn({
      message: 'Person not found with document',
      document: query_person.document,
    })

    throw new ErrorHandler('Pessoa não encontrada pelo documento', 404)
  }

  const data: PersonRequest[] = []

  for (const item of pending_analysis as PersonRequest[]) {
    if (user_info.user_type === 'client' && item.company_name === user_info.company_name) {
      data.push(item)
    } else if (user_info.user_type !== 'client') {
      data.push(item)
    }
  }

  for (const item of finished_analysis as PersonRequest[]) {
    if (user_info.user_type === 'client' && item.company_name === user_info.company_name) {
      data.push(item)
    } else if (user_info.user_type !== 'client') {
      data.push(item)
    }
  }

  return data
}

export default queryRequestPersonByDocumentAdapter
