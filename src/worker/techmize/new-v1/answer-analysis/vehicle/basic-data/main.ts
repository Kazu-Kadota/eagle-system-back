import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { S3Client } from '@aws-sdk/client-s3'
import { mockTechmizeNewV1AnswerAnalysisVehicleBasicDataGetResponse } from 'src/mock/techmize/new-v1/answer-analysis/vehicle/basic-data/get-response'
import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { AnalysisTypeEnum, VehicleAnalysisTypeEnum, VehicleThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { SQSStepFunctionController } from 'src/models/lambda'
import { TechmizeNewV1DadosBasicosVeiculoResponseData } from 'src/models/techmize/new-v1/dados-basicos-veiculo/response'
import { techmizeNewV1GetResponseNotFinishedErrorResponseMessage } from 'src/models/techmize/new-v1/get-response-error'
import { TechimzeVehicleSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import s3VehicleAnalysisAnswerThirdPartyPut from 'src/services/aws/s3/vehicle-analysis/answer/third-party/put'
import sendTaskSuccess from 'src/services/aws/step-functions/send-task-success'
import techmizeNewV1GetResponse, { TechmizeNewV1GetResponseResponse } from 'src/services/techmize/new-v1/get-response'
import useCaseAnswerVehicleAnalysis, { UseCaseAnswerVehicleAnalysisParams } from 'src/use-cases/answer-vehicle-analysis'
import { VehicleSnsMountMessageReturn } from 'src/use-cases/publish-techimze-sns-topic-vehicle/vehicle-sns-mount-message'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import getFinishedVehicleAdapter from './get-finished-vehicle-adapter'
import sendPresignedUrl from './send-presigned-url'
import validateBody from './validate-body'

const STAGE = getStringEnv('STAGE')
const REQUEST_INFORMATION_THIRD_PARTY = getStringEnv('REQUEST_INFORMATION_THIRD_PARTY')

export type TechmizeNewV1AnswerAnalysisVehicleBasicDataBodyValue = VehicleSnsMountMessageReturn & {
  retry?: boolean
}

export type TechmizeNewV1AnswerAnalysisVehicleBasicDataBody = {
  vehicle: {
    [VehicleAnalysisTypeEnum.BASIC_DATA]: TechmizeNewV1AnswerAnalysisVehicleBasicDataBodyValue
  }
}

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const eventBridgeClient = new EventBridgeClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const s3Client = new S3Client({
  region: 'us-east-1',
  maxAttempts: 5,
})

const techmizeNewV1AnswerAnalysisVehicleBasicData: SQSStepFunctionController<TechimzeVehicleSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on verify if techmize has response for vehicle basic data',
  })
  const body = validateBody((message.body as TechmizeNewV1AnswerAnalysisVehicleBasicDataBody).vehicle[VehicleAnalysisTypeEnum.BASIC_DATA])

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

  const get_response_techimze = STAGE === 'prd' || REQUEST_INFORMATION_THIRD_PARTY === 'true'

  const vehicle_basic_data_result: TechmizeNewV1GetResponseResponse = get_response_techimze
    ? await techmizeNewV1GetResponse({
      protocol: body.protocol,
    })
    : mockTechmizeNewV1AnswerAnalysisVehicleBasicDataGetResponse

  if (vehicle_basic_data_result.code === 0) {
    if (vehicle_basic_data_result.data === techmizeNewV1GetResponseNotFinishedErrorResponseMessage) {
      logger.info({
        message: `TECHMIZE: Response of protocol ${body.protocol} returned message waiting`,
        error: {
          ...vehicle_basic_data_result,
        },
      })

      const return_body: TechmizeNewV1AnswerAnalysisVehicleBasicDataBody = {
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

  const dados_basicos = vehicle_basic_data_result.data as TechmizeNewV1DadosBasicosVeiculoResponseData

  const third_party = VehicleThirdPartyEnum.TECHMIZE

  const s3_response_key = await s3VehicleAnalysisAnswerThirdPartyPut({
    analysis_type: AnalysisTypeEnum.VEHICLE,
    body: JSON.stringify(dados_basicos),
    request_id,
    s3_client: s3Client,
    third_party,
    vehicle_analysis_type: VehicleAnalysisTypeEnum.ANTT,
    vehicle_id,
  })

  const use_case_answer_vehicle_analysis_params: UseCaseAnswerVehicleAnalysisParams = {
    analysis_info: s3_response_key,
    analysis_result: AnalysisResultEnum.REJECTED,
    dynamodbClient,
    from_db: false,
    request_id,
    s3Client,
    vehicle_id,
  }

  await useCaseAnswerVehicleAnalysis(use_case_answer_vehicle_analysis_params)

  const finished_vehicle_key: VehicleRequestKey = {
    vehicle_id,
    request_id,
  }

  const finished_vehicle = await getFinishedVehicleAdapter(finished_vehicle_key, dynamodbClient)

  await sendPresignedUrl({
    event_bridge_client: eventBridgeClient,
    finished_vehicle,
    s3_client: s3Client,
    s3_key: s3_response_key,
  })

  await sendTaskSuccess({
    output: JSON.stringify([{
      message: `TECHMIZE: Response of protocol ${body.protocol} returned code 1`,
    }]),
    sfnClient: message.sfnClient,
    task_token: message.taskToken,
  })

  logger.info({
    message: 'Finish on answer analysis vehicle basic data',
    vehicle_id,
  })

  return {
    success: true,
    statusCode: 200,
  }
}

export default techmizeNewV1AnswerAnalysisVehicleBasicData
