import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SNSClient } from '@aws-sdk/client-sns'
import { AnalysisTypeEnum, VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { Controller } from 'src/models/lambda'
import { eagleTechimzeVehicleAnalysisTypeEnumMap } from 'src/models/techmize/eagle-techimze-enum-map'
import techmizeV2CustomRequestConsultar, { TechmizeV2ConsultarParams } from 'src/services/techmize/v2/custom-request'
import useCasePublishSnsTopicVehicle from 'src/use-cases/publish-techimze-sns-topic-vehicle'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import getCompanyByNameAdapter from './get-company-adapter'
import validateBodyVehicleBasicData from './validate-body-vehicle'
import vehicleBasicDataAnalysis, { VehicleAnalysisRequest } from './vehicle-basic-data'
import verifyAllowanceToBasicData from './verify-allowance-to-antt'

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

  const company_name = user_info.user_type === 'admin'
    ? body.company_name as string
    : user_info.company_name

  const company = await getCompanyByNameAdapter(company_name, dynamodbClient)

  await verifyAllowanceToBasicData(company.company_id, dynamodbClient)

  const vehicle_analysis_constructor: VehicleAnalysisRequest = {
    analysis_type: AnalysisTypeEnum.VEHICLE,
    body,
    dynamodbClient,
    user_info,
  }

  const consultar_params: TechmizeV2ConsultarParams = {
    cpf: vehicle_analysis_constructor.body.owner_document,
    type_request: eagleTechimzeVehicleAnalysisTypeEnumMap[VehicleAnalysisTypeEnum.BASIC_DATA],
    licenseplate: vehicle_analysis_constructor.body.plate,
  }

  const techmize_response = await techmizeV2CustomRequestConsultar(consultar_params)

  if (techmize_response.code === 0) {
    logger.warn({
      message: `TECHMIZE: Error on process consult ${consultar_params.type_request}`,
      error: {
        ...techmize_response,
      },
    })

    throw new ErrorHandler(`TECHMIZE: Error on process consult ${consultar_params.type_request}`, 500)
  }

  vehicle_analysis_constructor.third_party = techmize_response.data

  const vehicle_analysis = await vehicleBasicDataAnalysis(vehicle_analysis_constructor)

  await useCasePublishSnsTopicVehicle({
    owner_document: body.owner_document,
    plate: vehicle_analysis.plate,
    protocol: techmize_response.data.protocol,
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
