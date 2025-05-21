import { AttributeValue, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SynthesisRequest } from 'src/models/dynamo/request-synthesis'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { Controller } from 'src/models/lambda'
import queryRequestSynthesisByCompany, { QueryRequestSynthesisByCompany } from 'src/services/aws/dynamo/request/synthesis/query-by-company'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import { limitSizeOfArray } from 'src/utils/memory-size-of'
import { Exact } from 'src/utils/types/exact'

import getFeatureFlagAdapter from './get-feature-flag-adapter'
import queryCompanyByNameAdapter from './query-company-adapter'
import validateSynthesisQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
})

export type QuerySynthesisByCompanyControllerSyntheses = Omit<SynthesisRequest,
  'text_input'
  | 'text_output'
>

const querySynthesisByCompanyController: Controller = async (event) => {
  const user_info = event.user_info as UserInfoFromJwt

  const query = validateSynthesisQuery({ ...event.queryStringParameters })

  if (user_info.user_type === UserGroupEnum.ADMIN && !query.company_name) {
    logger.warn({
      message: 'Need to inform company name for admin user',
      user_type: user_info.user_type,
    })

    throw new ErrorHandler('É necessário informar o nome da empresa para usuários admin', 400)
  }

  const company_name = user_info.user_type === UserGroupEnum.ADMIN
    ? query.company_name as string
    : user_info.company_name

  const company = await queryCompanyByNameAdapter(company_name, dynamodbClient)

  const feature_flag = await getFeatureFlagAdapter(company.company_id, dynamodbClient)

  const diff_date = (new Date(query.start_date).getTime() - new Date(query.end_date).getTime()) / 1000 / 60 / 60 / 24

  if (user_info.user_type === UserGroupEnum.CLIENT && feature_flag.config.range_date_limit > diff_date) {
    logger.warn({
      message: 'Range data limit exceed for this company',
      ...query,
      diff_date,
      range_date_limit: feature_flag.config.range_date_limit,
    })

    throw new ErrorHandler('Não é possível verificar síntese entre datas maiores de ' + feature_flag.config.range_date_limit + ' dias', 400)
  }

  const request_synthesis_query: QueryRequestSynthesisByCompany = {
    company_name,
    final_date: query.end_date,
    start_date: query.start_date,
  }

  const syntheses: Array<QuerySynthesisByCompanyControllerSyntheses> = []

  let last_evaluated_key: Record<string, AttributeValue> | undefined

  do {
    const synthesis = await queryRequestSynthesisByCompany({
      data: request_synthesis_query,
      dynamodbClient,
      last_evaluated_key,
    })

    if (synthesis && synthesis.result) {
      for (const item of synthesis.result) {
        const { text_input, text_output, ...rest_item } = item

        const synthesis: Exact<QuerySynthesisByCompanyControllerSyntheses, typeof rest_item> = rest_item

        syntheses.push(synthesis)
      }
      last_evaluated_key = synthesis.last_evaluated_key
    }

    if (limitSizeOfArray(syntheses, 5.9)) {
      last_evaluated_key = undefined
    }
  } while (last_evaluated_key)

  syntheses.sort(
    (r1, r2) => r1.created_at > r2.created_at
      ? 1
      : r1.created_at < r2.created_at
        ? -1
        : 0,
  )

  logger.info({
    message: 'Finish on query synthesis by company',
    ...request_synthesis_query,
  })

  return {
    body: {
      message: 'Finish on query synthesis by company',
      syntheses,
    },
  }
}

export default querySynthesisByCompanyController
