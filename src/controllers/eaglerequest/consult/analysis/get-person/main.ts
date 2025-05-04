import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { PersonRequestKey } from 'src/models/dynamo/request-person'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'
import { Controller } from 'src/models/lambda'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import getRequestPersonAdapter from './get-person-adapter'
import getS3AnalysisInfoAdapter, { GetS3AnalysisInfoAdapterParams } from './get-s3-analysis-info-adapter'
import validatePersonParam from './validate-param'
import validatePersonQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
})

const s3Client = new S3Client({
  region: 'us-east-1',
})

const getPersonByRequestIdController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt

  const { person_id } = validatePersonParam({ ...req.pathParameters })
  const { request_id } = validatePersonQuery({ ...req.queryStringParameters })

  const request_person_key: PersonRequestKey = {
    person_id,
    request_id,
  }

  const request_person = await getRequestPersonAdapter(request_person_key, user_info, dynamodbClient)

  if (user_info.user_type === UserGroupEnum.OPERATOR) {
    const operator_companies_access_key: OperatorCompaniesAccessKey = {
      user_id: user_info.user_id,
    }

    const operator_companies_access = await getOperatorCompaniesAccess(operator_companies_access_key, dynamodbClient)

    const to_be_shown_operator = !operator_companies_access || (operator_companies_access && operator_companies_access.companies.includes(request_person.company_name))

    if (!to_be_shown_operator) {
      logger.info({
        message: 'User not allowed to receive response',
        request_id,
        person_id,
      })

      throw new ErrorHandler('Análise de pessoa não encontrada.', 404)
    }
  }

  if (request_person.finished_at) {
    // Is temporary
    const is_s3_path = request_person.analysis_info?.split('.')[1] === 'json'

    if (is_s3_path) {
      const get_s3_analysis_info_params: GetS3AnalysisInfoAdapterParams = {
        analysis_info: request_person.analysis_info as string,
        s3_client: s3Client,
        third_party: !!request_person.third_party,
      }

      const analysis_info = await getS3AnalysisInfoAdapter(get_s3_analysis_info_params)

      request_person.analysis_info = analysis_info
    }
  }

  if (user_info.user_type === UserGroupEnum.CLIENT) {
    delete request_person.third_party
  }

  logger.info({
    message: 'Finish on get person request info',
    request_id,
    person_id,
  })

  return {
    body: {
      message: 'Finish on get request person',
      person: request_person,
    },
  }
}

export default getPersonByRequestIdController
