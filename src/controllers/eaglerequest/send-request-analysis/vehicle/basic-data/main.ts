import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SNSClient } from '@aws-sdk/client-sns'
import { AnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { Controller } from 'src/models/lambda'
import useCasePublishSnsTopicVehicle from 'src/use-cases/publish-techimze-sns-topic-vehicle'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import validateBodyVehicleBasicData from './validate-body-vehicle'
import vehicleBasicDataAnalysis, { VehicleAnalysisRequest } from './vehicle-basic-data'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const snsClient = new SNSClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const requestAnalysisVehicleBasicData: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyVehicleBasicData(event_body)

  if (user_info.user_type === 'admin' && !body.company_name) {
    logger.warn({
      message: 'Need to inform company name for admin user',
      user_type: user_info.user_type,
    })

    throw new ErrorHandler('É necessário informar o nome da empresa para usuários admin', 400)
  }

  const vehicle_analysis_constructor: VehicleAnalysisRequest = {
    analysis_type: AnalysisTypeEnum.VEHICLE,
    body,
    dynamodbClient,
    user_info,
  }

  const vehicle_analysis = await vehicleBasicDataAnalysis(vehicle_analysis_constructor)

  await useCasePublishSnsTopicVehicle({
    owner_document: body.owner_document,
    plate: vehicle_analysis.plate,
    request_id: vehicle_analysis.request_id,
    snsClient,
    vehicle_analysis_type: vehicle_analysis.vehicle_analysis_type,
    vehicle_id: vehicle_analysis.vehicle_id,
  })

  logger.info({
    message: 'Successfully requested to analyze vehicle basic data',
    request_id: vehicle_analysis.request_id,
    vehicle_id: vehicle_analysis.vehicle_id,
    plate: body.plate,
  })

  return {
    body: {
      message: 'Successfully requested to analyze vehicle basic data',
      ...vehicle_analysis,
    },
  }
}

export default requestAnalysisVehicleBasicData
