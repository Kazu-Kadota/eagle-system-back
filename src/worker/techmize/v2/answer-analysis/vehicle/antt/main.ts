import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { mockTechmizeV2AnswerAnalysisVehicleANTTGetResponse } from 'src/mock/techmize/v2/answer-analysis/vehicle/antt/get-response'
import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SQSStepFunctionController } from 'src/models/lambda'
import { TechimzeVehicleSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV2ConsultarANTTRequestBody } from 'src/models/techmize/v2/consultar-antt/request-body'
import { TechmizeV2ConsultarANTTResponseSuccess } from 'src/models/techmize/v2/consultar-antt/response'
import { TechmizeV2GetRequestErrorResponse, techmizeV2GetRequestProcessingResponseMessage } from 'src/models/techmize/v2/get-response-error'
import { TechmizeV2GetResponseRequestBody } from 'src/models/techmize/v2/get-response-request-body'
import sendTaskSuccess from 'src/services/aws/step-functions/send-task-success'
import techmizeV2GetResponse, { TechmizeV2GetResponseResponse } from 'src/services/techmize/v2/get-response'
import useCaseAnswerVehicleAnalysis, { UseCaseAnswerVehicleAnalysisParams } from 'src/use-cases/answer-vehicle-analysis'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

const STAGE = getStringEnv('STAGE')

export type TechmizeV2AnswerAnalysisVehicleANTTBodyValue = TechmizeV2ConsultarANTTRequestBody & TechmizeV2GetResponseRequestBody & {
  retry?: boolean
}

export type TechmizeV2AnswerAnalysisVehicleANTTBody = {
  vehicle: {
    [VehicleAnalysisTypeEnum.ANTT]: TechmizeV2AnswerAnalysisVehicleANTTBodyValue
  }
}

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const techmizeV2AnswerAnalysisVehicleANTT: SQSStepFunctionController<TechimzeVehicleSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on verify if techmize has response for antt',
  })
  const body = validateBody((message.body as TechmizeV2AnswerAnalysisVehicleANTTBody).vehicle[VehicleAnalysisTypeEnum.ANTT])

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

  const antt_result: TechmizeV2GetResponseResponse | TechmizeV2GetRequestErrorResponse = STAGE === 'prd'
    ? await techmizeV2GetResponse({
      protocol: body.protocol,
    })
    : mockTechmizeV2AnswerAnalysisVehicleANTTGetResponse

  if (antt_result.code === 0) {
    if (antt_result.message === techmizeV2GetRequestProcessingResponseMessage) {
      logger.info({
        message: `TECHMIZE: Response of protocol ${body.protocol} returned message waiting`,
        error: {
          ...antt_result,
        },
      })

      const return_body: TechmizeV2AnswerAnalysisVehicleANTTBody = {
        vehicle: {
          [VehicleAnalysisTypeEnum.ANTT]: {
            ...body,
            retry: true,
          },
        },
      }

      const task_success = [{
        messageAttributes: message.message_attributes,
        messageId: message.message_id,
        body: JSON.stringify(return_body),
        code: antt_result.code,
        message: antt_result.message,
        data: antt_result.data,
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
        ...antt_result,
      },
    })

    throw new ErrorHandler(`TECHMIZE: Response of protocol ${body.protocol} returned code 0`, 500)
  }

  logger.debug({
    message: 'Start on answer analysis vehicle antt',
  })

  const antt = (antt_result as TechmizeV2ConsultarANTTResponseSuccess).data.antt

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

export default techmizeV2AnswerAnalysisVehicleANTT
