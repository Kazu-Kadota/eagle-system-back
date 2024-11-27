import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum, PlateStateEnum, RequestStatusEnum, VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { VehicleRequestAnalysisTypeBody, VehicleRequestAnalysisTypeForms } from 'src/models/dynamo/request-vehicle-analysis-type'
import putRequestVehicleANTT from 'src/services/aws/dynamo/request/analysis/vehicle/antt/put'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import removeEmpty from 'src/utils/remove-empty'
import { v4 as uuid } from 'uuid'

import getVehicleId from './get-vehicle-id'

export type VehicleAnalysisRequest = {
  analysis_type: AnalysisTypeEnum
  body: VehicleRequestAnalysisTypeForms
  dynamodbClient: DynamoDBClient
  third_party?: any
  user_info: UserInfoFromJwt
}

export type VehicleANTTAnalysisResponse = {
  request_id: string
  vehicle_id: string
  plate: string
  plate_state: PlateStateEnum
  vehicle_analysis_type: VehicleAnalysisTypeEnum.ANTT
}

const vehicleANTTAnalysis = async (
  data: VehicleAnalysisRequest,
): Promise<VehicleANTTAnalysisResponse> => {
  const {
    analysis_type,
    body,
    dynamodbClient,
    user_info,
    third_party,
  } = data

  const request_id = uuid()

  const vehicle_id = await getVehicleId(body.plate, body.plate_state, dynamodbClient)

  const data_request_vehicle: VehicleRequestAnalysisTypeBody = {
    ...body,
    analysis_type,
    company_name: user_info.user_type === 'admin' ? body.company_name as string : user_info.company_name,
    status: RequestStatusEnum.PROCESSING,
    third_party,
    user_id: user_info.user_id,
    vehicle_analysis_type: VehicleAnalysisTypeEnum.ANTT,
  }

  const request_vehicle_body = removeEmpty(data_request_vehicle)

  const request_vehicle_key: VehicleRequestKey = {
    request_id,
    vehicle_id,
  }

  await putRequestVehicleANTT(request_vehicle_key, request_vehicle_body, dynamodbClient)

  return {
    request_id,
    vehicle_id,
    plate: body.plate,
    plate_state: body.plate_state,
    vehicle_analysis_type: VehicleAnalysisTypeEnum.ANTT,
  }
}

export default vehicleANTTAnalysis
