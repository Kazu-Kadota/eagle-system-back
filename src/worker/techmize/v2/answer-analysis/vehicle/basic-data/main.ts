import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SQSStepFunctionController } from 'src/models/lambda'
import { TechimzeVehicleSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV2ConsultarDadosBasicosVeiculoRequestBody } from 'src/models/techmize/v2/consultar-dados-basicos-veiculo/request-body'
import { TechmizeV2ConsultarDadosBasicosVeiculoResponseSuccess } from 'src/models/techmize/v2/consultar-dados-basicos-veiculo/response'
import { techmizeV2GetRequestProcessingResponseMessage } from 'src/models/techmize/v2/get-response-error'
import { TechmizeV2GetResponseRequestBody } from 'src/models/techmize/v2/get-response-request-body'
import sendTaskSuccess from 'src/services/aws/step-functions/send-task-success'
import techmizeV2GetResponse from 'src/services/techmize/v2/get-response'
import useCaseAnswerVehicleAnalysis, { UseCaseAnswerVehicleAnalysisParams } from 'src/use-cases/answer-vehicle-analysis'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

export type TechmizeV2AnswerAnalysisVehicleBasicDataBodyValue = TechmizeV2ConsultarDadosBasicosVeiculoRequestBody & TechmizeV2GetResponseRequestBody & {
  retry?: boolean
}

export type TechmizeV2AnswerAnalysisVehicleBasicDataBody = {
  vehicle: {
    [VehicleAnalysisTypeEnum.BASIC_DATA]: TechmizeV2AnswerAnalysisVehicleBasicDataBodyValue
  }
}

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const techmizeV2AnswerAnalysisVehicleBasicData: SQSStepFunctionController<TechimzeVehicleSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on verify if techmize has response for vehicle basic data',
  })
  const body = validateBody((message.body as TechmizeV2AnswerAnalysisVehicleBasicDataBody).vehicle[VehicleAnalysisTypeEnum.BASIC_DATA])

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

  const vehicle_basic_data_result = await techmizeV2GetResponse({
    protocol: body.protocol,
  })

  if (vehicle_basic_data_result.code === 0) {
    if (vehicle_basic_data_result.message === techmizeV2GetRequestProcessingResponseMessage) {
      logger.info({
        message: `TECHMIZE: Response of protocol ${body.protocol} returned message waiting`,
        error: {
          ...vehicle_basic_data_result,
        },
      })

      const return_body: TechmizeV2AnswerAnalysisVehicleBasicDataBody = {
        vehicle: {
          [VehicleAnalysisTypeEnum.BASIC_DATA]: {
            ...body,
            retry: true,
          },
        },
      }

      const task_success = [{
        messageAttributes: message.message_attributes,
        messageId: message.message_id,
        body: JSON.stringify(return_body),
        code: vehicle_basic_data_result.code,
        message: vehicle_basic_data_result.message,
        data: vehicle_basic_data_result.data,
      }]

      await sendTaskSuccess({
        output: JSON.stringify(task_success),
        sfnClient: message.sfnClient,
        task_token: message.taskToken,
      })

      return {
        success: true,
        statusCode: 200,
      }
    }

    logger.warn({
      message: `TECHMIZE: Response of protocol ${body.protocol} returned code 0`,
      error: {
        ...vehicle_basic_data_result,
      },
    })

    throw new ErrorHandler(`TECHMIZE: Response of protocol ${body.protocol} returned code 0`, 500)
  }

  logger.debug({
    message: 'Start on answer analysis vehicle basic data',
  })

  const dados_basicos = (vehicle_basic_data_result as TechmizeV2ConsultarDadosBasicosVeiculoResponseSuccess).data.dados_basicos

  const use_case_answer_vehicle_analysis_params: UseCaseAnswerVehicleAnalysisParams = {
    analysis_info: JSON.stringify(dados_basicos, null, 2),
    analysis_result: AnalysisResultEnum.REJECTED,
    from_db: false,
    request_id,
    vehicle_id,
  }

  await useCaseAnswerVehicleAnalysis(use_case_answer_vehicle_analysis_params, dynamodbClient)

  logger.info({
    message: 'Finish on answer analysis vehicle basic data',
    vehicle_id,
  })

  await sendTaskSuccess({
    output: JSON.stringify([{
      message: `TECHMIZE: Response of protocol ${body.protocol} returned code 1`,
    }]),
    sfnClient: message.sfnClient,
    task_token: message.taskToken,
  })

  return {
    success: true,
    statusCode: 200,
  }
}

export default techmizeV2AnswerAnalysisVehicleBasicData
