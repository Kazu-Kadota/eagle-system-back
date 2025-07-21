import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { S3Client } from '@aws-sdk/client-s3'
import { mockTechmizeNewV1AnswerAnalysisPersonProcessGetResponse } from 'src/mock/techmize/new-v1/answer-analysis/person/process/get-response'
import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { AnalysisTypeEnum, PersonAnalysisTypeEnum, PersonThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { PersonRequestKey } from 'src/models/dynamo/request-person'
import { SQSStepFunctionController } from 'src/models/lambda'
import { techmizeNewV1GetResponseNotFinishedErrorResponseMessage } from 'src/models/techmize/new-v1/get-response-error'
import { TechmizeNewV1ProcessosResponseData } from 'src/models/techmize/new-v1/processos/response'
import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import s3PersonAnalysisAnswerThirdPartyPut from 'src/services/aws/s3/person-analysis/answer/third-party/put'
import sendTaskSuccess from 'src/services/aws/step-functions/send-task-success'
import techmizeNewV1GetResponse, { TechmizeNewV1GetResponseResponse } from 'src/services/techmize/new-v1/get-response'
import useCaseAnswerPersonAnalysis, { UseCaseAnswerPersonAnalysisParams } from 'src/use-cases/answer-person-analysis'
import { PersonSnsMountMessageReturn } from 'src/use-cases/publish-techimze-sns-topic-person/person-sns-mount-message'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import getFinishedPersonAdapter from './get-finished-person-adapter'
import sendPresignedUrl from './send-presigned-url'
import validateBody from './validate-body'

const STAGE = getStringEnv('STAGE')
const REQUEST_INFORMATION_THIRD_PARTY = getStringEnv('REQUEST_INFORMATION_THIRD_PARTY')

export type TechmizeNewV1AnswerAnalysisProcessBodyValue = PersonSnsMountMessageReturn & {
  retry?: boolean
}

export type TechmizeNewV1AnswerAnalysisProcessBody = {
  person: {
    [PersonAnalysisTypeEnum.PROCESS]: TechmizeNewV1AnswerAnalysisProcessBodyValue
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

const techmizeNewV1AnswerAnalysisProcess: SQSStepFunctionController<TechimzePersonSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on verify if techmize has response for process',
  })
  const body = validateBody((message.body as TechmizeNewV1AnswerAnalysisProcessBody).person[PersonAnalysisTypeEnum.PROCESS])

  const request_id = message.message_attributes.request_id.stringValue
  const person_id = message.message_attributes.person_id.stringValue

  if (!request_id) {
    logger.warn({
      message: 'Not informed request_id in message_attributes',
      message_attributes: message.message_attributes,
    })

    throw new ErrorHandler('Not informed request ids in message attributes', 500)
  }

  if (!person_id) {
    logger.warn({
      message: 'Not informed person_id in message attributes',
      message_attributes: message.message_attributes,
    })

    throw new ErrorHandler('Not informed person_id in message attributes', 500)
  }

  const get_response_techimze = STAGE === 'prd' || REQUEST_INFORMATION_THIRD_PARTY === 'true'

  const process_result: TechmizeNewV1GetResponseResponse = get_response_techimze
    ? await techmizeNewV1GetResponse({
      protocol: body.protocol,
    })
    : mockTechmizeNewV1AnswerAnalysisPersonProcessGetResponse

  if (process_result.code === 0) {
    if (process_result.data === techmizeNewV1GetResponseNotFinishedErrorResponseMessage) {
      logger.info({
        message: `TECHMIZE: Response of protocol ${body.protocol} returned message waiting`,
        error: {
          ...process_result,
        },
      })

      const return_body: TechmizeNewV1AnswerAnalysisProcessBody = {
        person: {
          [PersonAnalysisTypeEnum.PROCESS]: {
            ...body,
            retry: true,
          },
        },
      }

      const task_success = [{
        messageAttributes: message.message_attributes,
        messageId: message.message_id,
        body: JSON.stringify(return_body),
        code: process_result.code,
        message: process_result.message,
        data: process_result.data,
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
        ...process_result,
      },
    })

    throw new ErrorHandler(`TECHMIZE: Response of protocol ${body.protocol} returned code 0`, 500)
  }

  logger.debug({
    message: 'Start on answer analysis processos',
  })

  const processos = process_result.data as TechmizeNewV1ProcessosResponseData

  const third_party = PersonThirdPartyEnum.TECHMIZE

  const s3_response_key = await s3PersonAnalysisAnswerThirdPartyPut({
    analysis_type: AnalysisTypeEnum.PERSON,
    body: JSON.stringify(processos),
    person_analysis_type: PersonAnalysisTypeEnum.PROCESS,
    person_id,
    request_id,
    s3_client: s3Client,
    third_party,
  })

  const answer_person_analysis_params: UseCaseAnswerPersonAnalysisParams = {
    analysis_info: s3_response_key,
    analysis_result: AnalysisResultEnum.REJECTED,
    dynamodbClient,
    from_db: false,
    person_id,
    request_id,
    s3Client,
  }

  await useCaseAnswerPersonAnalysis(answer_person_analysis_params)

  const finished_person_key: PersonRequestKey = {
    person_id,
    request_id,
  }

  const finished_person = await getFinishedPersonAdapter(finished_person_key, dynamodbClient)

  await sendPresignedUrl({
    event_bridge_client: eventBridgeClient,
    finished_person,
    s3_client: s3Client,
    s3_key: s3_response_key,
  })

  logger.info({
    message: 'Finish on answer analysis processos',
    person_id,
  })

  await sendTaskSuccess({
    output: JSON.stringify([{
      code: 1,
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

export default techmizeNewV1AnswerAnalysisProcess
