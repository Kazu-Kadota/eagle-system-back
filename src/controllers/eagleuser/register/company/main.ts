import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import putCompany from 'src/services/aws/dynamo/company/put'
import queryByCnpj from 'src/services/aws/dynamo/company/query-by-cnpj'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import validateRegisterCompany from './validate'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const registerCompany = async (event: APIGatewayProxyEvent): Promise<ReturnResponse<any>> => {
  const body = validateRegisterCompany(JSON.parse(event.body as string))

  const companyExist = await queryByCnpj(body.cnpj, dynamodbClient)

  if (companyExist && companyExist[0]) {
    logger.warn({
      message: 'Company already exist with this cnpj',
      company_name: body.name,
    })

    throw new ErrorHandler('Empresa já existe com este cnpj', 409)
  }

  await putCompany(body, dynamodbClient)

  logger.info({
    message: 'Company registered successfully',
    company_name: body.name,
  })

  return {
    body: {
      message: 'Company registered successfully',
      company_name: body.name,
    },
  }
}

export default registerCompany
