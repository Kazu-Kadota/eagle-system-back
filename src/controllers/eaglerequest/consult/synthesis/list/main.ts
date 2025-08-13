import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SynthesisRequest } from 'src/models/dynamo/request-synthesis'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { OperatorCompaniesAccess, OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'
import { Controller } from 'src/models/lambda'
import scanRequestSynthesis, { ScanRequestSynthesisRequest, ScanRequestSynthesisResponse } from 'src/services/aws/dynamo/request/synthesis/scan'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import { limitSizeOfArray } from 'src/utils/memory-size-of'
import { Exact } from 'src/utils/types/exact'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

export type listSynthesisRequest = Omit<SynthesisRequest, 'text_input' | 'text_output' | 'third_party'>

const listSynthesisController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt

  let last_evaluated_key
  const scan: ScanRequestSynthesisRequest = {}
  const syntheses: listSynthesisRequest[] = []

  if (user_info.user_type === 'client') {
    scan.company_name = user_info.company_name
  }

  let operator_companies_access: OperatorCompaniesAccess | undefined

  if (user_info.user_type === UserGroupEnum.OPERATOR) {
    const operator_companies_access_key: OperatorCompaniesAccessKey = {
      user_id: user_info.user_id,
    }

    operator_companies_access = await getOperatorCompaniesAccess(operator_companies_access_key, dynamodbClient)
  }

  do {
    const query_result: ScanRequestSynthesisResponse | undefined = await scanRequestSynthesis(
      scan,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!query_result) {
      logger.info({
        message: 'Finish on get people request info',
      })

      return {
        body: {
          message: 'Finish on query analysis people',
          people: syntheses,
        },
      }
    }

    if (query_result?.result) {
      for (const item of query_result.result) {
        if (user_info.user_type !== UserGroupEnum.ADMIN) {
          if (user_info.user_type === UserGroupEnum.OPERATOR) {
            const to_be_shown_operator = !operator_companies_access || (operator_companies_access && operator_companies_access.companies.includes(item.company_name))

            if (!to_be_shown_operator) {
              continue
            }
          }

          const { third_party, text_input, text_output, ...synthesis_item } = item

          const synthesis: Exact<listSynthesisRequest, typeof synthesis_item> = synthesis_item

          syntheses.push(synthesis)
        } else {
          syntheses.push(item)
        }
      }
    }

    if (limitSizeOfArray(syntheses, 5.9)) {
      last_evaluated_key = undefined
    }

    last_evaluated_key = query_result.last_evaluated_key
  } while (last_evaluated_key)

  syntheses.sort(
    (r1, r2) => r1.created_at > r2.created_at
      ? 1
      : r1.created_at < r2.created_at
        ? -1
        : 0,
  )

  logger.info({
    message: 'Finish on list request synthesis',
  })

  return {
    body: {
      message: 'Finish on list request synthesis',
      syntheses,
    },
  }
}

export default listSynthesisController
