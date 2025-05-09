import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { Controller } from 'src/models/lambda'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import getUserAdapter from './get-user-adapter'
import validateQueryOperatorCompaniesAccessGet from './validate-query'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const operatorCompaniesAccessGetController: Controller = async (req) => {
  const body = validateQueryOperatorCompaniesAccessGet({ ...req.queryStringParameters })

  const user = await getUserAdapter({ user_id: body.user_id }, dynamodbClient)

  if (user.user_type !== UserGroupEnum.OPERATOR) {
    logger.warn({
      message: 'User is not operator type',
      user_id: user.user_id,
    })

    throw new ErrorHandler('Usuário não é do tipo operador', 400)
  }

  const operator_companies_access = await getOperatorCompaniesAccess({
    user_id: body.user_id,
  }, dynamodbClient)

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

export default operatorCompaniesAccessGetController
