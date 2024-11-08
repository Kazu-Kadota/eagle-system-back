import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum, PlateStateEnum, RequestStatusEnum, VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { VehicleRequestAnalysisTypeBody, VehicleRequestAnalysisTypeForms } from 'src/models/dynamo/request-vehicle-analysis-type'
import putRequestVehicleBasicData from 'src/services/aws/dynamo/request/analysis/vehicle/basic-data/put'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import removeEmpty from 'src/utils/remove-empty'
import { v4 as uuid } from 'uuid'

import getVehicleId from './get-vehicle-id'

export type VehicleAnalysisRequest = {
  analysis_type: AnalysisTypeEnum
  body: VehicleRequestAnalysisTypeForms
  dynamodbClient: DynamoDBClient
  user_info: UserInfoFromJwt
}

export type VehicleBasicDataAnalysisResponse = {
  request_id: string
  vehicle_id: string
  plate: string
  plate_state: PlateStateEnum
  vehicle_analysis_type: VehicleAnalysisTypeEnum.BASIC_DATA
}

const vehicleBasicDataAnalysis = async (
  data: VehicleAnalysisRequest,
): Promise<VehicleBasicDataAnalysisResponse> => {
  const {
    analysis_type,
    body,
    dynamodbClient,
    user_info,
  } = data

  const request_id = uuid()

  const vehicle_id = await getVehicleId(body.plate, body.plate_state, dynamodbClient)

  const data_request_vehicle: VehicleRequestAnalysisTypeBody = {
    ...body,
    analysis_type,
    company_name: user_info.user_type === 'admin' ? body.company_name as string : user_info.company_name,
    user_id: user_info.user_id,
    status: RequestStatusEnum.PROCESSING,
    vehicle_analysis_type: VehicleAnalysisTypeEnum.BASIC_DATA,
  }

  const request_vehicle_body = removeEmpty(data_request_vehicle)

  const request_vehicle_key: VehicleRequestKey = {
    request_id,
    vehicle_id,
  }

  await putRequestVehicleBasicData(request_vehicle_key, request_vehicle_body, dynamodbClient)

  return {
    request_id,
    vehicle_id,
    plate: body.plate,
    plate_state: body.plate_state,
    vehicle_analysis_type: VehicleAnalysisTypeEnum.BASIC_DATA,
  }
}

export default vehicleBasicDataAnalysis
