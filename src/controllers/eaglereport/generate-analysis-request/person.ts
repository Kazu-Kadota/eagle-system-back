import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum, RequestStatusEnum } from 'src/models/dynamo/request-enum'
import queryRequestPersonByCompany, { QueryRequestPersonByCompany, QueryRequestPersonByCompanyResponse } from 'src/services/aws/dynamo/request/analysis/person/query-by-company'
import queryFinishedRequestPersonByCompany, { QueryFinishedRequestPersonByCompanyResponse } from 'src/services/aws/dynamo/request/finished/person/query-by-company'

export interface ResultPersonReport {
  created_at: string
  finished_at?: string | undefined
  analysis_type: AnalysisTypeEnum
  company_name: string
  person_id: string
  request_id: string
  status: RequestStatusEnum
  document: string
  name: string
}

export interface PersonReportResponse {
  result: ResultPersonReport[]
  count: number
}

const personReport = async (
  data: QueryRequestPersonByCompany,
  dynamodbClient: DynamoDBClient,
): Promise<PersonReportResponse> => {
  const result = []
  let last_evaluated_key
  let count: number = 0

  do {
    const query_waiting_processing_result: QueryRequestPersonByCompanyResponse | undefined = await queryRequestPersonByCompany(
      data,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!query_waiting_processing_result) {
      break
    }

    for (const item of query_waiting_processing_result.result) {
      const {
        birth_date,
        mother_name,
        rg,
        state_rg,
        user_id,
        category_cnh,
        cnh,
        expire_at_cnh,
        father_name,
        naturalness,
        security_number_cnh,
        ...rest_item
      } = item
      result.push(rest_item)
    }

    count += query_waiting_processing_result.count

    last_evaluated_key = query_waiting_processing_result?.last_evaluated_key
  } while (last_evaluated_key)

  do {
    const query_finished_result: QueryFinishedRequestPersonByCompanyResponse | undefined = await queryFinishedRequestPersonByCompany(
      data,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!query_finished_result) {
      break
    }

    for (const item of query_finished_result.result) {
      const {
        birth_date,
        mother_name,
        rg,
        state_rg,
        user_id,
        category_cnh,
        cnh,
        expire_at_cnh,
        father_name,
        naturalness,
        security_number_cnh,
        ...rest_item
      } = item
      result.push(rest_item)
    }

    count += query_finished_result.count

    last_evaluated_key = query_finished_result?.last_evaluated_key
  } while (last_evaluated_key)

  return {
    result,
    count,
  }
}

export default personReport
