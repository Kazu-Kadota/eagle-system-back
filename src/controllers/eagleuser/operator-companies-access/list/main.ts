import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Controller } from 'src/models/lambda'
import scanOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/scan'
import logger from 'src/utils/logger'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const operatorCompaniesAccessListController: Controller = async () => {
  const operator_companies_access = await scanOperatorCompaniesAccess(dynamodbClient)

  logger.info({
    message: 'Successfully got operator companies access',
    operator_companies_access,
  })

  return {
    body: {
      message: 'Successfully got operator companies access',
      operator_companies_access,
    },
  }
}

export default operatorCompaniesAccessListController
