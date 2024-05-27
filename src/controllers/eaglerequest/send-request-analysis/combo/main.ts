import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { Controller } from 'src/models/lambda'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'
import { v4 as uuid } from 'uuid'

import personAnalysisConstructor, { PersonAnalysisConstructor } from '../person/person_analysis_constructor'
import vehicleAnalysis, { ReturnVehicleAnalysis, VehicleAnalysisRequest } from '../vehicle/default/vehicle'

import validateBodyCombo from './validate-body-combo'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const requestAnalysisCombo: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyCombo(event_body)

  if (body.combo_number !== body.vehicles.length) {
    logger.warn({
      message: 'Number of vehicles informed is different to number of vehicles requested',
      analysis_type: AnalysisTypeEnum.COMBO,
    })

    throw new ErrorHandler('Número de veículos informado é diferente ao númbero de veículos solicitados', 400)
  }

  const combo_id = uuid()

  let person_analyzes

  for (const person_analysis of body.person_analysis) {
    const person_analysis_request: PersonAnalysisConstructor = {
      analysis_type: AnalysisTypeEnum.COMBO,
      combo_id,
      combo_number: body.combo_number,
      dynamodbClient,
      person_data: body.person,
      user_info,
    }

    person_analyzes = await personAnalysisConstructor(person_analysis, person_analysis_request)
  }

  const vehicles_analysis: ReturnVehicleAnalysis[] = []

  for (const vehicle of body.vehicles) {
    vehicle.driver_name = body.person.name

    const vehicle_analysis_constructor: VehicleAnalysisRequest = {
      analysis_type: AnalysisTypeEnum.VEHICLE,
      body: vehicle,
      combo_id,
      combo_number: body.combo_number,
      dynamodbClient,
      user_info,
    }

    vehicles_analysis.push(await vehicleAnalysis(vehicle_analysis_constructor))
  }

  return {
    body: {
      message: 'Successfully requested to analyze combo',
      analysis_type: AnalysisTypeEnum.COMBO,
      combo_id,
      person: person_analyzes,
      vehicles: vehicles_analysis,
    },
  }
}

export default requestAnalysisCombo
