import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SQSController } from 'src/models/lambda'

import { TechimzeVehicleSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV1ConsultarANTTRequestBody } from 'src/models/techmize/v1/consultar-antt/request-body'
import { techmizeV1SuccessErrorResponse } from 'src/models/techmize/v1/error'
import techmizeV1ConsultarANTT from 'src/services/techmize/v1/consultar-antt'
import useCaseAnswerVehicleAnalysis, { UseCaseAnswerVehicleAnalysisParams } from 'src/use-cases/answer-vehicle-analysis'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

export type TechmizeV1AnswerAnalysisVehicleANTTBody = {
  vehicle: {
    [VehicleAnalysisTypeEnum.ANTT]: TechmizeV1ConsultarANTTRequestBody
  }
}

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const techmizeV1AnswerAnalysisVehicleANTT: SQSController<TechimzeVehicleSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on answer analysis vehicle antt',
  })
  const body = validateBody((message.body as TechmizeV1AnswerAnalysisVehicleANTTBody).vehicle[VehicleAnalysisTypeEnum.ANTT])

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

  const antt_result = await techmizeV1ConsultarANTT({
    cpf: body.cpf,
    licenseplate: body.licenseplate,
  })

  const antt = antt_result.data.antt

  if (antt === techmizeV1SuccessErrorResponse) {
    logger.warn({
      message: 'TECHMIZE: Returned success on request antt result, but received error instead',
      antt_result,
    })

    throw new ErrorHandler('TECHMIZE: Returned success on request antt result, but received error instead', 500)
  }

  const use_case_answer_vehicle_analysis_params: UseCaseAnswerVehicleAnalysisParams = {
    analysis_info: JSON.stringify(antt, null, 2),
    analysis_result: AnalysisResultEnum.REJECTED,
    from_db: false,
    request_id,
    vehicle_id,
  }

  await useCaseAnswerVehicleAnalysis(use_case_answer_vehicle_analysis_params, dynamodbClient)

  logger.info({
    message: 'Finish on answer analysis antt',
    person_id: vehicle_id,
  })

  return {
    success: true,
    statusCode: 200,
  }
}

export default techmizeV1AnswerAnalysisVehicleANTT
