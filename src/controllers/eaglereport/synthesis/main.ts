import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { defaultHeaders } from 'src/constants/headers'
import { Controller } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import checkRulesAndCompanyName from './check-rules-and-company-name'
import convertCsv from './convert-csv'
import getCompanyByNameAdapter from './get-company-adapter'
import synthesisReport from './synthesis-report'
import validateReportQuery from './validate-report-query'
import verifyAllowanceToSynthesis from './verify-allowance-to-synthesis'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const reportSynthesis: Controller = async (event) => {
  const user_info = event.user_info as UserInfoFromJwt

  const { company, summary, ...query } = validateReportQuery({ ...event.queryStringParameters })

  const query_final_date = new Date(query.final_date)
  query_final_date.setDate(query_final_date.getDate() + 1)
  const final_date = query_final_date.toISOString()

  const company_name = checkRulesAndCompanyName({
    company_name: company,
    start_date: query.start_date,
    user_info,
  })

  const user_company = await getCompanyByNameAdapter(company_name, dynamodbClient)

  await verifyAllowanceToSynthesis({
    user_info,
    company_id: user_company.company_id,
    dynamoDBClient: dynamodbClient,
  })

  const data = {
    ...query,
    final_date,
    company_name,
  }

  const synthesis_report = await synthesisReport(data, dynamodbClient)

  const csv = convertCsv({
    company_name,
    summary,
    synthesis_report,
  })

  logger.info({
    message: 'Finish on generate person report',
    start_date: data.start_date,
    final_date: data.final_date,
    company_name,
    summary,
  })

  return {
    headers: {
      ...defaultHeaders,
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=synthesis_report_${new Date().toISOString().split('T')[0]}_${company_name}_${summary ? 'summarized' : 'detailed'}.csv`,
    },
    statusCode: 200,
    body: csv,
    notJsonBody: true,
  }
}

export default reportSynthesis
