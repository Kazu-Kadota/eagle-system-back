import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { RequestStatusEnum, VehicleType } from 'src/models/dynamo/request-enum'
import queryRequestVehicleByCompany, { QueryRequestVehicleByCompany, QueryRequestVehicleByCompanyResponse } from 'src/services/aws/dynamo/request/analysis/vehicle/query-by-company'
import queryFinishedRequestVehicleByCompany, { QueryFinishedRequestVehicleByCompanyResponse } from 'src/services/aws/dynamo/request/finished/vehicle/query-by-company'

export interface ResultVehicleReport {
  created_at: string
  finished_at?: string | undefined
  company_name: string
  request_id: string
  status: RequestStatusEnum
  vehicle_id: string
  owner_document: string
  owner_name: string
  plate: string
  vehicle_type: VehicleType
}

export interface VehicleReportResponse {
  result: ResultVehicleReport[]
  count: number
}

const vehicleReport = async (
  data: QueryRequestVehicleByCompany,
  dynamodbClient: DynamoDBClient,
): Promise<VehicleReportResponse> => {
  const result = []
  let last_evaluated_key
  let count: number = 0

  do {
    const query_waiting_processing_result: QueryRequestVehicleByCompanyResponse | undefined = await queryRequestVehicleByCompany(
      data,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!query_waiting_processing_result) {
      break
    }

    for (const item of query_waiting_processing_result.result) {
      const {
        analysis_type,
        user_id,
        chassis,
        driver_name,
        plate_state,
        renavam,
        ...rest_item
      } = item
      result.push(rest_item)
    }

    count += query_waiting_processing_result.count

    last_evaluated_key = query_waiting_processing_result?.last_evaluated_key
  } while (last_evaluated_key)

  do {
    const query_finished_result: QueryFinishedRequestVehicleByCompanyResponse | undefined = await queryFinishedRequestVehicleByCompany(
      data,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!query_finished_result) {
      break
    }

    for (const item of query_finished_result.result) {
      const {
        analysis_type,
        user_id,
        chassis,
        driver_name,
        plate_state,
        renavam,
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

export default vehicleReport
