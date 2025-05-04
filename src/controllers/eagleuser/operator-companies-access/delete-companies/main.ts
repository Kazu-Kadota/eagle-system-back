import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { OperatorCompaniesAccessBody, OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'
import { Controller } from 'src/models/lambda'
import deleteOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/delete'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
import updateOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/update'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import validateBodyOperatorCompaniesAccessDeleteCompanies from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const operatorCompaniesAccessDeleteCompaniesController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyOperatorCompaniesAccessDeleteCompanies(event_body)

  const operator_companies_access_key: OperatorCompaniesAccessKey = {
    user_id: body.user_id,
  }

  const operator_companies_access = await getOperatorCompaniesAccess(
    operator_companies_access_key,
    dynamodbClient,
  )

  if (!operator_companies_access) {
    logger.warn({
      message: 'There is no operator companies access',
      user_id: body.user_id,
    })

    throw new ErrorHandler('Não há usuário cadastrado para exclusão de empresas', 400)
  }

  const set_companies = new Set<string>(operator_companies_access.companies)

  for (const company of body.companies) {
    set_companies.delete(company)
  }

  if (set_companies.size === 0) {
    await deleteOperatorCompaniesAccess(operator_companies_access_key, dynamodbClient)

    logger.info({
      message: 'Successfully deleted operator companies access',
      user_id: user_info.user_id,
    })

    return {
      body: {
        message: 'Successfully deleted operator companies access',
        user_id: user_info.user_id,
      },
    }
  }

  const operator_companies_access_body: OperatorCompaniesAccessBody = {
    companies: Array.from(set_companies),
  }

  await updateOperatorCompaniesAccess(
    operator_companies_access_key,
    operator_companies_access_body,
    dynamodbClient,
  )

  logger.info({
    message: 'Successfully updated operator companies access',
    user_id: user_info.user_id,
  })

  return {
    body: {
      message: 'Successfully updated operator companies access',
      user_id: user_info.user_id,
    },
  }
}

export default operatorCompaniesAccessDeleteCompaniesController
