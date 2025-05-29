import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlag, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import queryCompanyByName from 'src/services/aws/dynamo/company/query-by-name'

import queryFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/query'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { ListCompaniesResponseBodyCompanies } from './main'

export type CompaniesResponseMapParams = {
  company_name: string
  feature_flag: boolean
  dynamodbClient: DynamoDBClient
}

const companiesResponseMap = async ({
  company_name,
  feature_flag,
  dynamodbClient,
}: CompaniesResponseMapParams): Promise<ListCompaniesResponseBodyCompanies> => {
  const company_array = await queryCompanyByName(company_name, dynamodbClient)

  if (!company_array || !company_array[0]) {
    logger.error({
      message: 'Company not exist',
      company_name,
    })

    throw new ErrorHandler('Empresa não cadastrada', 500)
  }

  const company = company_array[0]

  if (feature_flag) {
    const feature_flag_arr = await queryFeatureFlag({
      company_id: company.company_id,
    }, dynamodbClient)

    if (!feature_flag_arr || !feature_flag_arr.feature_flag[0]) {
      return {
        company_id: company.company_id,
        name: company.name,
      }
    }

    const feature_flags = feature_flag_arr.feature_flag
      .map<Pick<FeatureFlag<FeatureFlagsEnum>, 'feature_flag' | 'enabled'> | undefined>((value) => value.enabled
        ? {
            feature_flag: value.feature_flag,
            enabled: value.enabled,
          }
        : undefined)
      .filter((value): value is Pick<FeatureFlag<FeatureFlagsEnum>, 'feature_flag' | 'enabled'> => value !== undefined)

    return {
      company_id: company.company_id,
      name: company.name,
      feature_flag: feature_flags,
    }
  }

  return {
    company_id: company.company_id,
    name: company.name,
  }
}

export default companiesResponseMap
