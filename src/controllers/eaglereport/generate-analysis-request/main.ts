import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { stringify } from 'csv-stringify/sync'
import { ReturnResponse } from 'src/models/lambda'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import personReport from './person'
import validateReportPath from './validate-report-path'

import validateReportQuery from './validate-report-query'
import vehicleReport from './vehicle'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const reportAnalysis = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  if (!event.queryStringParameters) {
    logger.warn({
      message: 'There is no query parameters on request',
    })

    throw new ErrorHandler('Não há parâmetro de query na solicitação', 400)
  }

  const { company, ...query } = validateReportQuery({ ...event.queryStringParameters })
  const { path_type } = validateReportPath({ ...event.pathParameters })

  const query_final_date = new Date(query.final_date)
  query_final_date.setDate(query_final_date.getDate() + 1)
  const final_date = query_final_date.toISOString()

  if (user_info.user_type === 'client'
    && new Date(query.start_date).valueOf() < new Date().valueOf() - 60 * 24 * 60 * 60 * 1000
  ) {
    logger.warn({
      message: 'Requested report more earlier than 60 days',
      ...query,
    })

    throw new ErrorHandler('Não é possível gerar relatório com mais de 60 dias de diferença', 400)
  }

  let company_name: string

  if (user_info.user_type === 'admin') {
    if (!company) {
      logger.warn({
        message: 'Is necessary inform company to generate report',
      })

      throw new ErrorHandler('É necessário informar a empresa para gerar relatório', 400)
    }
    company_name = company
  } else {
    company_name = user_info.company_name
  }

  if (path_type === 'person') {
    const data = {
      ...query,
      final_date,
      company_name,
    }

    logger.debug({
      message: 'Creating person report',
      start_date: data.start_date,
      final_date: data.final_date,
      company_name: data.company_name,
    })

    const person_report = await personReport(data, dynamodbClient)

    logger.debug({
      message: 'Converting to CSV',
    })

    person_report.result.sort(
      (r1, r2) => r1.created_at > r2.created_at
        ? 1
        : r1.created_at < r2.created_at
          ? -1
          : 0,
    )

    const columns: Record<string, string> = {
      company_name: 'Nome da empresa',
      request_id: 'ID da requisição',
      person_id: 'ID da pessoa',
      name: 'Nome',
      document: 'Documento',
      person_analysis_type: 'Tipo de análise da pessoa',
      region_type: 'Região de pesquisa',
      status: 'Status da análise',
      created_at: 'Data de criação da análise',
      finished_at: 'Data de resposta da análise',
    }

    if (user_info.user_type === 'admin') {
      columns.analysis_result = 'Resposta da análise'
    }

    const csv = stringify(person_report.result, {
      header: true,
      columns,
      bom: true,
    })

    logger.info({
      message: 'Finish on generate person report',
      start_date: data.start_date,
      final_date: data.final_date,
      company_name,
      count: person_report.count,
    })

    return {
      body: {
        csv,
        path: 'person',
      },
    }
  }

  const data = {
    ...query,
    final_date,
    company_name,
  }

  logger.debug({
    message: 'Creating vehicle report',
    start_date: data.start_date,
    final_date: data.final_date,
    company_name: data.company_name,
  })

  const vehicle_report = await vehicleReport(data, dynamodbClient)

  logger.debug({
    message: 'Converting to CSV',
  })

  vehicle_report.result.sort(
    (r1, r2) => r1.created_at > r2.created_at
      ? 1
      : r1.created_at < r2.created_at
        ? -1
        : 0,
  )

  const columns: Record<string, string> = {
    company_name: 'Nome da empresa',
    request_id: 'ID da requisição',
    vehicle_id: 'ID do veículo',
    plate: 'Placa',
    vehicle_type: 'Tipo do veículo',
    owner_name: 'Nome do dono',
    owner_document: 'Documento do dono',
    status: 'status',
    created_at: 'Data de criação da análise',
    finished_at: 'Data de resposta da análise',
  }

  if (user_info.user_type === 'admin') {
    columns.analysis_result = 'Resposta da análise'
  }

  const csv = stringify(vehicle_report.result, {
    header: true,
    columns,
    bom: true,
  })

  logger.info({
    message: 'Finish on generate vehicle report',
    start_date: data.start_date,
    final_date: data.final_date,
    company_name,
    count: vehicle_report.count,
  })

  return {
    body: {
      csv,
      path: 'vehicle',
    },
  }
}

export default reportAnalysis
