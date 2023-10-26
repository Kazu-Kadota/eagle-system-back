import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum, PlateStateEnum, RequestStatusEnum } from 'src/models/dynamo/request-enum'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { VehicleRequestPlateHistoryBody, VehicleRequestPlateHistoryForms } from 'src/models/dynamo/request-vehicle-plate-history'
import putRequestVehiclePlateHistory from 'src/services/aws/dynamo/request/analysis/vehicle/plate-history/put'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'
import { v4 as uuid } from 'uuid'

import getVehicleId from './get-vehicle-id'

export interface VehicleAnalysisRequest {
  analysis_type: AnalysisTypeEnum
  body: VehicleRequestPlateHistoryForms
  dynamodbClient: DynamoDBClient
  user_info: UserInfoFromJwt
}

export interface ReturnVehicleAnalysis {
  request_id: string
  vehicle_id: string
  plate: string
  plate_state: PlateStateEnum
}

const vehiclePlateHistoryAnalysis = async (
  data: VehicleAnalysisRequest,
): Promise<ReturnVehicleAnalysis> => {
  const {
    analysis_type,
    body,
    dynamodbClient,
    user_info,
  } = data

  const request_id = uuid()

  const vehicle_id = await getVehicleId(body.plate, body.plate_state, dynamodbClient)

  const data_request_vehicle: VehicleRequestPlateHistoryBody = {
    ...body,
    analysis_type,
    company_name: user_info.user_type === 'admin' ? body.company_name as string : user_info.company_name,
    user_id: user_info.user_id,
    status: RequestStatusEnum.WAITING,
  }

  const request_vehicle_body = removeEmpty(data_request_vehicle)

  const request_vehicle_key: VehicleRequestKey = {
    request_id,
    vehicle_id,
  }

  await putRequestVehiclePlateHistory(request_vehicle_key, request_vehicle_body, dynamodbClient)

  logger.info({
    message: 'Successfully requested to analyze vehicle plate history',
    request_id,
    vehicle_id,
    plate: body.plate,
  })

  return {
    request_id,
    vehicle_id,
    plate: body.plate,
    plate_state: body.plate_state,
  }
}

export default vehiclePlateHistoryAnalysis
