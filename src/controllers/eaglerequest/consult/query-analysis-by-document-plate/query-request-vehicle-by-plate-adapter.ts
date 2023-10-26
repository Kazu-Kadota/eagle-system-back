import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { VehicleRequest } from 'src/models/dynamo/request-vehicle'
import queryRequestVehicleByPlate from 'src/services/aws/dynamo/request/analysis/vehicle/query-by-plate'
import queryRequestFinishedVehicleByPlate from 'src/services/aws/dynamo/request/finished/vehicle/query-by-plate'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import { RequestVehicleByPlateQuery } from './validate-query-vehicle'

const queryRequestVehicleByPlateAdapter = async (
  query_vehicle: RequestVehicleByPlateQuery,
  dynamodbClient: DynamoDBClient,
  user_info: UserInfoFromJwt,
): Promise<VehicleRequest[]> => {
  logger.debug({
    message: 'Requested query vehicle by plate',
    plate: query_vehicle.plate,
  })

  const pending_analysis = await queryRequestVehicleByPlate(
    query_vehicle,
    dynamodbClient,
  )

  const finished_analysis = await queryRequestFinishedVehicleByPlate(
    query_vehicle,
    dynamodbClient,
  )

  if ((!pending_analysis || !pending_analysis[0]) && (!finished_analysis || !finished_analysis[0])) {
    logger.warn({
      message: 'Vehicle not found with plate',
      plate: query_vehicle.plate,
    })

    throw new ErrorHandler('Veículo não encontrado pela placa', 404)
  }

  const data: VehicleRequest[] = []

  for (const item of pending_analysis as VehicleRequest[]) {
    if (user_info.user_type === 'client' && item.company_name === user_info.company_name) {
      data.push(item)
    } else if (user_info.user_type !== 'client') {
      data.push(item)
    }
  }

  for (const item of finished_analysis as VehicleRequest[]) {
    if (user_info.user_type === 'client' && item.company_name === user_info.company_name) {
      data.push(item)
    } else if (user_info.user_type !== 'client') {
      data.push(item)
    }
  }

  return data
}

export default queryRequestVehicleByPlateAdapter
