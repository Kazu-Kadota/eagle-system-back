import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum, RequestStatusEnum } from 'src/models/dynamo/request-enum'
import { VehicleRequestBody, VehicleRequestForms, VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import putRequestVehicle from 'src/services/aws/dynamo/request/analysis/vehicle/put'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'
import { v4 as uuid } from 'uuid'

import getVehicleId from './get-vehicle-id'

export interface ReturnVehicleAnalysis {
  request_id: string
  vehicle_id: string
  company_name: string
  user_id: string
  owner_name: string
  plate: string
}

export interface VehicleAnalysisRequest {
  analysis_type: AnalysisTypeEnum
  body: VehicleRequestForms
  dynamodbClient: DynamoDBClient
  user_info: UserInfoFromJwt
  combo_number?: number
}

const vehicleAnalysis = async (
  data: VehicleAnalysisRequest,
): Promise<ReturnVehicleAnalysis> => {
  const {
    analysis_type,
    body,
    dynamodbClient,
    user_info,
    combo_number,
  } = data

  const request_id = uuid()

  const vehicle_id = await getVehicleId(body.plate, body.plate_state, dynamodbClient)

  const data_request_vehicle: VehicleRequestBody = {
    ...body,
    analysis_type,
    combo_number: combo_number || undefined,
    company_name: user_info.user_type === 'admin' ? body.company_name as string : user_info.company_name,
    user_id: user_info.user_id,
    status: RequestStatusEnum.WAITING,
  }

  const request_vehicle_body = removeEmpty(data_request_vehicle)

  const request_vehicle_key: VehicleRequestKey = {
    request_id,
    vehicle_id,
  }

  await putRequestVehicle(request_vehicle_key, request_vehicle_body, dynamodbClient)

  logger.info({
    message: 'Successfully requested to analyze vehicle',
    request_id,
    vehicle_id,
    company_name: user_info.company_name,
    user_id: user_info.user_id,
    owner_name: body.owner_name,
    plate: body.plate,
  })

  return {
    request_id,
    vehicle_id,
    company_name: user_info.company_name,
    user_id: user_info.user_id,
    owner_name: body.owner_name,
    plate: body.plate,
  }
}

export default vehicleAnalysis
