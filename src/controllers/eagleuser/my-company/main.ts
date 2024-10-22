import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import getCompanyByNameAdapter from './get-company-adapter'
import listFeatureFlagAdapter, { ListFeatureFlagAdapterParams } from './list-feature-flag-adapter'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const myCompanyHandler = async (user_info: UserInfoFromJwt): Promise<ReturnResponse<any>> => {
  logger.info({
    message: 'Request to get company',
  })

  const company = await getCompanyByNameAdapter(user_info.company_id, dynamodbClient)

  const list_feature_flag_adapter_params: ListFeatureFlagAdapterParams = {
    company_id: company.company_id,
    dynamodbClient,
  }

  const feature_flag_array = await listFeatureFlagAdapter(list_feature_flag_adapter_params)

  logger.info({
    message: 'Success on get company',
    company_id: company.company_id,
  })

  return {
    body: {
      company,
      feature_flag: feature_flag_array,
    },
  }
}

export default myCompanyHandler
