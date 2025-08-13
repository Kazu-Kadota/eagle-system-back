import { AttributeValue, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SynthesisRequest } from 'src/models/dynamo/request-synthesis'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { Controller } from 'src/models/lambda'
import queryRequestSynthesisFinishedByDocument from 'src/services/aws/dynamo/request/synthesis/finished/query-by-document'
import queryRequestSynthesisByDocument, { QueryRequestSynthesisByDocument } from 'src/services/aws/dynamo/request/synthesis/query-by-document'
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

export type QuerySynthesisByDocumentControllerSyntheses = Omit<SynthesisRequest,
  'text_input'
  | 'text_output'
  | 'third_party'
>

const querySynthesisByDocumentController: Controller = async (event) => {
  const user_info = event.user_info as UserInfoFromJwt

  const query = validateSynthesisQuery({ ...event.queryStringParameters })

  if (user_info.user_type === UserGroupEnum.ADMIN && !query.company_name) {
    const request_synthesis_query: QueryRequestSynthesisByDocument = {
      document: query.document,
    }

    const syntheses: Array<QuerySynthesisByDocumentControllerSyntheses> = []

    let last_evaluated_key: Record<string, AttributeValue> | undefined

    do {
      const synthesis = await queryRequestSynthesisByDocument({
        data: request_synthesis_query,
        dynamodbClient,
        last_evaluated_key,
      })

      if (synthesis && synthesis.result) {
        for (const item of synthesis.result) {
          syntheses.push(item)
        }
        last_evaluated_key = synthesis.last_evaluated_key
      }

      if (limitSizeOfArray(syntheses, 5.9)) {
        last_evaluated_key = undefined
      }
    } while (last_evaluated_key)

    do {
      const synthesis = await queryRequestSynthesisFinishedByDocument({
        data: request_synthesis_query,
        dynamodbClient,
        last_evaluated_key,
      })

      if (synthesis && synthesis.result) {
        for (const item of synthesis.result) {
          syntheses.push(item)
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
      message: 'Finish on query synthesis by document',
      ...request_synthesis_query,
    })

    return {
      body: {
        message: 'Finish on query synthesis by document',
        syntheses,
      },
    }
  }

  const company_name = user_info.user_type === UserGroupEnum.ADMIN
    ? query.company_name!
    : user_info.company_name

  const company = await queryCompanyByNameAdapter(company_name, dynamodbClient)

  const feature_flag = await getFeatureFlagAdapter(company.company_id, dynamodbClient)

  const final_date = new Date().toISOString()

  const start_date = new Date(new Date().setDate(new Date(final_date).getDate() - feature_flag.config.range_date_limit)).toISOString()

  const request_synthesis_query: QueryRequestSynthesisByDocument = {
    company_name,
    final_date,
    start_date,
    document: query.document,
  }

  const syntheses: Array<QuerySynthesisByDocumentControllerSyntheses> = []

  let last_evaluated_key: Record<string, AttributeValue> | undefined

  do {
    const synthesis = await queryRequestSynthesisByDocument({
      data: request_synthesis_query,
      dynamodbClient,
      last_evaluated_key,
    })

    if (synthesis && synthesis.result) {
      for (const item of synthesis.result) {
        if (user_info.user_type === UserGroupEnum.ADMIN) {
          syntheses.push(item)
        } else {
          const { text_input, text_output, third_party, ...rest_item } = item

          const synthesis: Exact<QuerySynthesisByDocumentControllerSyntheses, typeof rest_item> = rest_item

          syntheses.push(synthesis)
        }
      }
      last_evaluated_key = synthesis.last_evaluated_key
    }

    if (limitSizeOfArray(syntheses, 5.9)) {
      last_evaluated_key = undefined
    }
  } while (last_evaluated_key)

  do {
    const synthesis = await queryRequestSynthesisFinishedByDocument({
      data: request_synthesis_query,
      dynamodbClient,
      last_evaluated_key,
    })

    if (synthesis && synthesis.result) {
      for (const item of synthesis.result) {
        if (user_info.user_type === UserGroupEnum.ADMIN) {
          syntheses.push(item)
        } else {
          const { text_input, text_output, third_party, ...rest_item } = item

          const synthesis: Exact<QuerySynthesisByDocumentControllerSyntheses, typeof rest_item> = rest_item

          syntheses.push(synthesis)
        }
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
    message: 'Finish on query synthesis by document',
    ...request_synthesis_query,
  })

  return {
    body: {
      message: 'Finish on query synthesis by document',
      syntheses,
    },
  }
}

export default querySynthesisByDocumentController
