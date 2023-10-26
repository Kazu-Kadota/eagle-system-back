import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'

import queryRequestVehicleByIdAdapter from './query-request-vehicle-by-id-adapter'

import validateVehicleParam from './validate-request-vehicle'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const queryVehicleByIdController = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  const { vehicle_id } = validateVehicleParam({ ...event.pathParameters })

  const request_vehicle = await queryRequestVehicleByIdAdapter(
    vehicle_id,
    user_info,
    dynamodbClient,
  )

  return {
    body: {
      message: 'Finish on get vehicle request info',
      vehicle: request_vehicle,
    },
  }
}

export default queryVehicleByIdController
