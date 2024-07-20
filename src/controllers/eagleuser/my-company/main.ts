import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ReturnResponse } from 'src/models/lambda'
import logger from 'src/utils/logger'

import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import getCompanyByNameAdapter from './get-company-adapter'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const myCompanyHandler = async (user_info: UserInfoFromJwt): Promise<ReturnResponse<any>> => {
  logger.info({
    message: 'Request to get company',
  })

  const company = await getCompanyByNameAdapter(user_info.company_id, dynamodbClient)

  logger.info({
    message: 'Success on get company',
    company_id: company.company_id,
  })

  return {
    body: company,
  }
}

export default myCompanyHandler
