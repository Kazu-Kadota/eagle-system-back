import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Company } from 'src/models/dynamo/company'
import { FeatureFlag, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { Controller } from 'src/models/lambda'
import scanCompany, { ScanCompanyResponse } from 'src/services/aws/dynamo/company/scan'
import queryFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/query'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import { v4 as uuid } from 'uuid'

import companiesResponseMap from './companies-response-map'
import validateQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

export type ListCompaniesResponseBodyCompanies = Pick<Company, 'company_id' | 'name'> & {
  feature_flag?: Array<Pick<FeatureFlag<FeatureFlagsEnum>, 'feature_flag' | 'enabled'> | undefined>
}

export type ListCompaniesResponseBody = {
  message: string
  companies?: Array<ListCompaniesResponseBodyCompanies>
}

const listCompanies: Controller<ListCompaniesResponseBody> = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt

  const query = validateQuery({ ...req.queryStringParameters })

  if (user_info.user_type === UserGroupEnum.OPERATOR) {
    const operator_company_access = await getOperatorCompaniesAccess({
      user_id: user_info.user_id,
    }, dynamodbClient)

    if (operator_company_access) {
      const response_body: Array<ListCompaniesResponseBodyCompanies> = await Promise.all(operator_company_access.companies
        .map<Promise<ListCompaniesResponseBodyCompanies>>((value) => companiesResponseMap({
          company_name: value,
          feature_flag: query.feature_flag ?? false,
          dynamodbClient,
        })))

      logger.info({
        message: 'Finish on get companies',
        companies: response_body,
      })

      return {
        body: {
          message: 'Finish on get companies',
          companies: response_body,
        },
      }
    }
  }

  const request_id = uuid()
  let last_evaluated_key
  const result: Array<ListCompaniesResponseBodyCompanies> = []

  do {
    const scan: ScanCompanyResponse | undefined = await scanCompany(
      request_id,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!scan) {
      logger.info({
        message: 'Finish on get companies',
        companies: result,
      })

      return {
        body: {
          message: 'Finish on get companies',
          companies: result,
        },
      }
    }

    if (scan.result) {
      for (const item of scan.result) {
        const feature_flag_arr = await queryFeatureFlag({
          company_id: item.company_id,
        }, dynamodbClient)

        if (feature_flag_arr && feature_flag_arr.feature_flag[0]) {
          const feature_flags = feature_flag_arr.feature_flag
            .map<Pick<FeatureFlag<FeatureFlagsEnum>, 'feature_flag' | 'enabled'> | undefined>((value) => value.enabled
              ? {
                  feature_flag: value.feature_flag,
                  enabled: value.enabled,
                }
              : undefined)
            .filter((value) => value !== undefined)

          result.push({
            company_id: item.company_id,
            name: item.name,
            feature_flag: feature_flags,
          })
        } else {
          result.push({
            company_id: item.company_id,
            name: item.name,
          })
        }
      }
    }

    last_evaluated_key = scan.last_evaluated_key
  } while (last_evaluated_key)

  result.sort(
    (r1, r2) => r1.name > r2.name
      ? 1
      : r1.name < r2.name
        ? -1
        : 0,
  )

  logger.info({
    message: 'Finish on get companies',
    companies: result,
  })

  return {
    body: {
      message: 'Finish on get companies',
      companies: result,
    },
  }
}

export default listCompanies
