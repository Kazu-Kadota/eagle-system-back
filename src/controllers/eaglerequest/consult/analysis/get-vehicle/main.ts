import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'

import getVehicleAdapter from './get-vehicle-adapter'
import validateVehicleParam from './validate-param'
import validateVehicleQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const getVehicleByRequestIdController = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  const { vehicle_id } = validateVehicleParam({ ...event.pathParameters })
  const { request_id } = validateVehicleQuery({ ...event.queryStringParameters })

  const request_vehicle_key: VehicleRequestKey = {
    vehicle_id,
    request_id,
  }

  const request_vehicle = await getVehicleAdapter(request_vehicle_key, user_info, dynamodbClient)

  return {
    body: {
      message: 'Finish on get request vehicle',
      vehicle: request_vehicle,
    },
  }
}

export default getVehicleByRequestIdController
