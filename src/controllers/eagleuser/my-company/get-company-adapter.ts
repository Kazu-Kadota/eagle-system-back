import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Company, CompanyKey } from 'src/models/dynamo/company'
import getCompany from 'src/services/aws/dynamo/company/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const getCompanyByNameAdapter = async (
  company_id: string,
  dynamodbClient: DynamoDBClient,
): Promise<Company> => {
  const company_key: CompanyKey = {
    company_id,
  }
  const company = await getCompany(company_key, dynamodbClient)

  if (!company) {
    logger.warn({
      message: 'Company not exist',
      company_id: company_id,
    })

    throw new ErrorHandler('Company not exist', 404)
  }

  return company
}

export default getCompanyByNameAdapter
