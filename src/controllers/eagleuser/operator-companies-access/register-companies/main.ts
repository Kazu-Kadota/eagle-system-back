import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { OperatorCompaniesAccessBody, OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'
import { Controller } from 'src/models/lambda'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
import putOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/put'
import updateOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/update'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import getCompanyByNameAdapter from './get-company-adapter'
import getUserAdapter from './get-user-adapter'
import validateBodyOperatorCompaniesAccessRegister from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const operatorCompaniesAccessRegisterController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyOperatorCompaniesAccessRegister(event_body)

  const user = await getUserAdapter({ user_id: body.user_id }, dynamodbClient)

  if (user.user_type !== UserGroupEnum.OPERATOR) {
    logger.warn({
      message: 'User is not operator type',
      user_id: user.user_id,
    })

    throw new ErrorHandler('Usuário não é do tipo operador', 400)
  }

  const companies: Array<string> = []

  for (const company_name of body.companies) {
    const company = await getCompanyByNameAdapter(company_name, dynamodbClient)

    companies.push(company.name)
  }

  const operator_companies_access_key: OperatorCompaniesAccessKey = {
    user_id: body.user_id,
  }

  const operator_companies_access_body: OperatorCompaniesAccessBody = {
    companies: body.companies,
  }

  const operator_companies_access = await getOperatorCompaniesAccess(
    operator_companies_access_key,
    dynamodbClient,
  )

  if (!operator_companies_access) {
    await putOperatorCompaniesAccess(
      operator_companies_access_key,
      operator_companies_access_body,
      dynamodbClient,
    )
  } else {
    const set_companies = new Set<string>([...operator_companies_access.companies, ...companies])

    const operator_companies_access_body: OperatorCompaniesAccessBody = {
      companies: Array.from(set_companies),
    }

    await updateOperatorCompaniesAccess(
      operator_companies_access_key,
      operator_companies_access_body,
      dynamodbClient,
    )
  }

  logger.info({
    message: 'Successfully registered operator companies access',
    user_id: user_info.user_id,
  })

  return {
    body: {
      message: 'Successfully registered operator companies access',
      user_id: user_info.user_id,
    },
  }
}

export default operatorCompaniesAccessRegisterController
