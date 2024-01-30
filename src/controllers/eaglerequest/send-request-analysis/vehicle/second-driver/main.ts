import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { Controller } from 'src/models/lambda'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import validateBodyVehicleSecondDriver from './validate-body-vehicle'
import vehicleSecondDriverAnalysis, { VehicleAnalysisRequest } from './vehicle-second-driver'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const requestAnalysisVehicleSecondDriver: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyVehicleSecondDriver(event_body)

  if (user_info.user_type === 'admin' && !body.company_name) {
    logger.warn({
      message: 'Need to inform company name for admin user',
      user_type: user_info.user_type,
    })

    throw new ErrorHandler('É necessário informar o nome da empresa para usuários admin', 400)
  }

  const vehicle_analysis_constructor: VehicleAnalysisRequest = {
    analysis_type: AnalysisTypeEnum.VEHICLE_SECOND_DRIVER,
    body,
    dynamodbClient,
    user_info,
  }

  const vehicle_analysis = await vehicleSecondDriverAnalysis(vehicle_analysis_constructor)

  return {
    body: {
      message: 'Successfully requested to analyze vehicle second driver',
      ...vehicle_analysis,
    },
  }
}

export default requestAnalysisVehicleSecondDriver
