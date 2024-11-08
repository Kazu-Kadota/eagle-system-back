import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SQSController } from 'src/models/lambda'
import { TechimzeVehicleSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV1ConsultarDadosBasicosVeiculoRequestBody } from 'src/models/techmize/v1/consultar-dados-basicos-veiculo/request-body'
import techmizeV1ConsultarDadosBasicosVeiculo from 'src/services/techmize/v1/consultar-dados-basicos-veiculo'
import useCaseAnswerVehicleAnalysis, { UseCaseAnswerVehicleAnalysisParams } from 'src/use-cases/answer-vehicle-analysis'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

export type TechmizeV1AnswerAnalysisVehicleBasicDataBody = {
  vehicle: {
    [VehicleAnalysisTypeEnum.BASIC_DATA]: TechmizeV1ConsultarDadosBasicosVeiculoRequestBody
  }
}

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const techmizeV1AnswerAnalysisVehicleBasicData: SQSController<TechimzeVehicleSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on answer analysis vehicle basic data',
  })
  const body = validateBody((message.body as TechmizeV1AnswerAnalysisVehicleBasicDataBody).vehicle[VehicleAnalysisTypeEnum.BASIC_DATA])

  const request_id = message.message_attributes.request_id.stringValue
  const vehicle_id = message.message_attributes.vehicle_id.stringValue

  if (!request_id) {
    logger.warn({
      message: 'Not informed request_id in message_attributes',
      message_attributes: message.message_attributes,
    })

    throw new ErrorHandler('Not informed request ids in message attributes', 500)
  }

  if (!vehicle_id) {
    logger.warn({
      message: 'Not informed vehicle_id in message attributes',
      message_attributes: message.message_attributes,
    })

    throw new ErrorHandler('Not informed vehicle_id in message attributes', 500)
  }

  const vehicle_basic_data_result = await techmizeV1ConsultarDadosBasicosVeiculo({
    cpf: body.cpf,
    licenseplate: body.licenseplate,
  })

  const answer_vehicle_analysis_params: UseCaseAnswerVehicleAnalysisParams = {
    analysis_result: AnalysisResultEnum.REJECTED,
    from_db: false,
    vehicle_id,
    request_id,
    analysis_info: JSON.stringify(vehicle_basic_data_result.data.dados_basicos, null, 2),
  }

  await useCaseAnswerVehicleAnalysis(answer_vehicle_analysis_params, dynamodbClient)

  logger.info({
    message: 'Finish on answer analysis vehicle basic data',
    vehicle_id,
  })

  return {
    success: true,
    statusCode: 200,
  }
}

export default techmizeV1AnswerAnalysisVehicleBasicData
