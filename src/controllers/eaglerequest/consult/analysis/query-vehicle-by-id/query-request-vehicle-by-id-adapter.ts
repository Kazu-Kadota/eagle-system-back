import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import queryRequestVehicleById, { QueryRequestVehicleByIdQuery } from 'src/services/aws/dynamo/request/analysis/vehicle/query-by-id'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

const queryRequestVehicleByIdAdapter = async (
  vehicle_id: string,
  user_info: UserInfoFromJwt,
  dynamodbClient: DynamoDBClient,
) => {
  const query: QueryRequestVehicleByIdQuery = {
    vehicle_id,
  }

  const request_vehicle = await queryRequestVehicleById(query, dynamodbClient)

  if (!request_vehicle || !request_vehicle[0]) {
    logger.warn({
      message: 'Vehicle no exist',
      vehicle_id,
    })

    throw new ErrorHandler('Veículo não existe', 404)
  }

  if (
    user_info.user_type === 'client'
    && user_info.company_name !== request_vehicle[0].company_name
  ) {
    logger.warn({
      message: 'Vehicle not requested to analyze from company',
      company_name: user_info,
      vehicle_id,
    })

    throw new ErrorHandler('Veículo não solicitado para análise pela empresa', 401)
  }

  logger.info({
    message: 'Finish on get vehicle request info',
    vehicle: request_vehicle,
  })

  return request_vehicle[0]
}

export default queryRequestVehicleByIdAdapter
