import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { VehicleRequest, VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import getFinishedRequestVehicle from 'src/services/aws/dynamo/request/finished/vehicle/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const getFinishedVehicleAdapter = async (
  key: VehicleRequestKey,
  dynamodbClient: DynamoDBClient,
): Promise<VehicleRequest> => {
  const finished_vehicle = await getFinishedRequestVehicle(key, dynamodbClient)

  if (!finished_vehicle) {
    logger.warn({
      message: 'Vehicle not exist',
      request_id: key.request_id,
      vehicle_id: key.vehicle_id,
    })

    throw new ErrorHandler('Veículo não existe', 500)
  }

  return finished_vehicle
}

export default getFinishedVehicleAdapter
