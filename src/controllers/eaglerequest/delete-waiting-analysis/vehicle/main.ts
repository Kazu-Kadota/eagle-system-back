import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Controller } from 'src/models/lambda'
import deleteRequestVehicle from 'src/services/aws/dynamo/request/analysis/vehicle/delete'
import getRequestVehicle from 'src/services/aws/dynamo/request/analysis/vehicle/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import validateBodyDeleteWaitingAnalysisVehicle from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const deleteWaitingAnalysisVehicleController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const vehicle_request_key = validateBodyDeleteWaitingAnalysisVehicle(event_body)

  const request_vehicle = await getRequestVehicle(vehicle_request_key, dynamodbClient)

  if (!request_vehicle) {
    logger.warn({
      message: 'Vehicle not exist',
      ...vehicle_request_key,
    })

    throw new ErrorHandler('Veículo não existe', 404)
  }

  await deleteRequestVehicle(vehicle_request_key, dynamodbClient)

  logger.info({
    message: 'Successfully requested synthesis',
    ...vehicle_request_key,
    company_name: user_info.company_name,
    user_id: user_info.user_id,
  })

  return {
    body: {
      message: 'Successfully requested synthesis',
      ...vehicle_request_key,
    },
  }
}

export default deleteWaitingAnalysisVehicleController
