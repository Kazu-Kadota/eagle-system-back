import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PersonRequest } from 'src/models/dynamo/request-person'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { OperatorCompaniesAccess, OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'
import queryRequestPersonByDocument from 'src/services/aws/dynamo/request/analysis/person/query-by-document'
import queryFinishedRequestPersonByDocument from 'src/services/aws/dynamo/request/finished/person/query-by-document'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
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

  let operator_companies_access: OperatorCompaniesAccess | undefined

  if (user_info.user_type === UserGroupEnum.OPERATOR) {
    const operator_companies_access_key: OperatorCompaniesAccessKey = {
      user_id: user_info.user_id,
    }

    operator_companies_access = await getOperatorCompaniesAccess(operator_companies_access_key, dynamodbClient)
  }

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
    if (user_info.user_type === UserGroupEnum.CLIENT && item.company_name === user_info.company_name) {
      delete item.third_party
      data.push(item)
    } else if (user_info.user_type !== UserGroupEnum.CLIENT) {
      if (user_info.user_type === UserGroupEnum.OPERATOR) {
        const to_be_shown_operator = !operator_companies_access || (operator_companies_access && operator_companies_access.companies.includes(item.company_name))

        if (!to_be_shown_operator) {
          continue
        }
      }

      data.push(item)
    }
  }

  for (const item of finished_analysis as PersonRequest[]) {
    if (user_info.user_type === UserGroupEnum.CLIENT && item.company_name === user_info.company_name) {
      data.push(item)
    } else if (user_info.user_type !== UserGroupEnum.CLIENT) {
      if (user_info.user_type === UserGroupEnum.OPERATOR) {
        const to_be_shown_operator = !operator_companies_access || (operator_companies_access && operator_companies_access.companies.includes(item.company_name))

        if (!to_be_shown_operator) {
          continue
        }
      }

      data.push(item)
    }
  }

  return data
}

export default queryRequestPersonByDocumentAdapter
