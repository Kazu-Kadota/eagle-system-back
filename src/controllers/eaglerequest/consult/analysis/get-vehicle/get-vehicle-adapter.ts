import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { VehicleRequest, VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import getRequestVehicle from 'src/services/aws/dynamo/request/analysis/vehicle/get'
import getFinishedRequestVehicle from 'src/services/aws/dynamo/request/finished/vehicle/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

const getVehicleAdapter = async (
  key: VehicleRequestKey,
  user_info: UserInfoFromJwt,
  dynamodbClient: DynamoDBClient,
): Promise<VehicleRequest> => {
  const request_vehicle = await getRequestVehicle(key, dynamodbClient)

  if (request_vehicle) {
    if (
      user_info.user_type === 'client'
      && user_info.company_name !== request_vehicle.company_name
    ) {
      logger.warn({
        message: 'Vehicle not requested to analyze from company',
        company_name: user_info,
        request_id: key.request_id,
        vehicle_id: key.vehicle_id,
      })

      throw new ErrorHandler('Requisição de análise não solicitada pela empresa', 401)
    }

    logger.info({
      message: 'Finish on get vehicle request info',
      request_id: key.request_id,
      vehicle_id: key.vehicle_id,
    })

    return request_vehicle
  }

  const finished_vehicle = await getFinishedRequestVehicle(key, dynamodbClient)

  if (finished_vehicle) {
    if (
      user_info.user_type === 'client'
      && user_info.company_name !== finished_vehicle.company_name
    ) {
      logger.warn({
        message: 'Vehicle not requested to analyze from company',
        company_name: user_info,
        request_id: key.request_id,
        vehicle_id: key.vehicle_id,
      })

      throw new ErrorHandler('Requisição de análise não solicitada pela empresa', 401)
    }

    logger.info({
      message: 'Finish on get vehicle request info',
      request_id: key.request_id,
      vehicle_id: key.vehicle_id,
    })

    return finished_vehicle
  }

  logger.warn({
    message: 'Vehicle not exist',
    request_id: key.request_id,
    vehicle_id: key.vehicle_id,
  })

  throw new ErrorHandler('Veículo não existe', 404)
}

export default getVehicleAdapter
