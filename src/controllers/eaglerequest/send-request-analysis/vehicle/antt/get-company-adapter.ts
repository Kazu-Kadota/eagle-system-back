import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Company } from 'src/models/dynamo/company'
import queryCompanyByName from 'src/services/aws/dynamo/company/query-by-name'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const getCompanyByNameAdapter = async (
  company_name: string,
  dynamodbClient: DynamoDBClient,
): Promise<Company> => {
  const company = await queryCompanyByName(company_name, dynamodbClient)

  if (!company || !company[0]) {
    logger.warn({
      message: 'Company not exist',
      company_name,
    })

    throw new ErrorHandler('Company not exist', 404)
  }

  return company[0]
}

export default getCompanyByNameAdapter
