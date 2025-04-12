import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SNSClient } from '@aws-sdk/client-sns'
import { AnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { Controller } from 'src/models/lambda'
import { TechmizeNewV1ANTTRequestBody, techmizeNewV1ANTTTypeRequest } from 'src/models/techmize/new-v1/antt/request-body'
import techmizeNewV1StoreRequest from 'src/services/techmize/new-v1/store-request'
import useCasePublishSnsTopicVehicle from 'src/use-cases/publish-techimze-sns-topic-vehicle'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import getCompanyByNameAdapter from './get-company-adapter'
import validateBodyVehicleANTT from './validate-body-vehicle'
import vehicleANTTAnalysis, { VehicleAnalysisRequest } from './vehicle-antt'
import verifyAllowanceToANTT from './verify-allowance-to-antt'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const snsClient = new SNSClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const requestAnalysisVehicleANTT: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyVehicleANTT(event_body)

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

  await verifyAllowanceToANTT(company.company_id, dynamodbClient)

  const vehicle_analysis_constructor: VehicleAnalysisRequest = {
    analysis_type: AnalysisTypeEnum.VEHICLE,
    body,
    dynamodbClient,
    user_info,
  }

  const consultar_params: TechmizeNewV1ANTTRequestBody = {
    cpf_cnpj: vehicle_analysis_constructor.body.owner_document,
    plate: vehicle_analysis_constructor.body.plate,
    type_request: techmizeNewV1ANTTTypeRequest,
  }

  const techmize_response = await techmizeNewV1StoreRequest(consultar_params)

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

  const vehicle_analysis = await vehicleANTTAnalysis(vehicle_analysis_constructor)

  await useCasePublishSnsTopicVehicle({
    owner_document: body.owner_document,
    plate: vehicle_analysis.plate,
    protocol: techmize_response.data,
    request_id: vehicle_analysis.request_id,
    snsClient,
    vehicle_analysis_type: vehicle_analysis.vehicle_analysis_type,
    vehicle_id: vehicle_analysis.vehicle_id,
  })

  logger.info({
    message: 'Successfully requested to analyze vehicle antt',
    request_id: vehicle_analysis.request_id,
    vehicle_id: vehicle_analysis.vehicle_id,
    plate: body.plate,
  })

  return {
    body: {
      message: 'Successfully requested to analyze vehicle antt',
      ...vehicle_analysis,
    },
  }
}

export default requestAnalysisVehicleANTT
