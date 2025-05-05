import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Company } from 'src/models/dynamo/company'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { Controller } from 'src/models/lambda'
import scanCompany, { ScanCompanyResponse } from 'src/services/aws/dynamo/company/scan'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import { v4 as uuid } from 'uuid'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const listCompanies: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const request_id = uuid()
  let last_evaluated_key
  const result: Company[] = []

  if (user_info.user_type === UserGroupEnum.OPERATOR) {
    const operator_company_access = await getOperatorCompaniesAccess({
      user_id: user_info.user_id,
    }, dynamodbClient)

    if (operator_company_access) {
      logger.info({
        message: 'Finish on get companies',
        companies: operator_company_access.companies,
      })

      return {
        body: {
          message: 'Finish on get companies',
          companies: operator_company_access.companies,
        },
      }
    }
  }

  do {
    const scan: ScanCompanyResponse | undefined = await scanCompany(
      request_id,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!scan) {
      logger.info({
        message: 'Finish on get companies',
        companies: result,
      })

      return {
        body: {
          message: 'Finish on get companies',
          companies: result,
        },
      }
    }

    if (scan.result) {
      for (const item of scan.result) {
        result.push(item)
      }
    }

    last_evaluated_key = scan.last_evaluated_key
  } while (last_evaluated_key)

  result.sort(
    (r1, r2) => r1.name > r2.name
      ? 1
      : r1.name < r2.name
        ? -1
        : 0,
  )

  logger.info({
    message: 'Finish on get companies',
    companies: result,
  })

  return {
    body: {
      message: 'Finish on get companies',
      companies: result,
    },
  }
}

export default listCompanies
