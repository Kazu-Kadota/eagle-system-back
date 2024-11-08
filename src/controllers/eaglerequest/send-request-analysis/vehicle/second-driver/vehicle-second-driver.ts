import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum, PlateStateEnum, RequestStatusEnum, VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { VehicleRequestSecondDriverBody, VehicleRequestSecondDriverForms } from 'src/models/dynamo/request-vehicle-second-driver'
import putRequestVehicleSecondDriver from 'src/services/aws/dynamo/request/analysis/vehicle/second-driver/put'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'
import { v4 as uuid } from 'uuid'

import getVehicleId from './get-vehicle-id'

export interface VehicleAnalysisRequest {
  analysis_type: AnalysisTypeEnum
  body: VehicleRequestSecondDriverForms
  dynamodbClient: DynamoDBClient
  user_info: UserInfoFromJwt
}

export interface ReturnVehicleAnalysis {
  request_id: string
  vehicle_id: string
  plate: string
  plate_state: PlateStateEnum
}

const vehicleSecondDriverAnalysis = async (
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

  const data_request_vehicle: VehicleRequestSecondDriverBody = {
    ...body,
    analysis_type,
    company_name: user_info.user_type === 'admin' ? body.company_name as string : user_info.company_name,
    user_id: user_info.user_id,
    status: RequestStatusEnum.WAITING,
    vehicle_analysis_type: VehicleAnalysisTypeEnum.VEHICLE_SECOND_DRIVER,
  }

  const request_vehicle_body = removeEmpty(data_request_vehicle)

  const request_vehicle_key: VehicleRequestKey = {
    request_id,
    vehicle_id,
  }

  await putRequestVehicleSecondDriver(request_vehicle_key, request_vehicle_body, dynamodbClient)

  logger.info({
    message: 'Successfully requested to analyze vehicle second driver',
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

export default vehicleSecondDriverAnalysis
