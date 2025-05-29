import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { Controller } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import getCompanyByNameAdapter from './get-company-adapter'
import listFeatureFlagAdapter, { ListFeatureFlagAdapterParams } from './list-feature-flag-adapter'
import validateQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const myCompanyHandler: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt

  const query = validateQuery({ ...req.queryStringParameters })

  const company = await getCompanyByNameAdapter(user_info.company_id, dynamodbClient)

  let feature_flag: Array<FeatureFlagsEnum> | undefined

  if (query.feature_flag) {
    const list_feature_flag_adapter_params: ListFeatureFlagAdapterParams = {
      company_id: company.company_id,
      dynamodbClient,
    }

    feature_flag = await listFeatureFlagAdapter(list_feature_flag_adapter_params)
  }

  logger.info({
    message: 'Success on get company',
    company_id: company.company_id,
  })

  return {
    body: {
      company,
      feature_flag,
    },
  }
}

export default myCompanyHandler
