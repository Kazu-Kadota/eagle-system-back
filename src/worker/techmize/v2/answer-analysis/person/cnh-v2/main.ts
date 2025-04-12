import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { S3Client } from '@aws-sdk/client-s3'
import { mockTechmizeV2AnswerAnalysisPersonCNHV2GetResponse } from 'src/mock/techmize/v2/answer-analysis/person/cnh-v2/get-response'
import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { AnalysisTypeEnum, PersonAnalysisTypeEnum, PersonThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { PersonRequestKey } from 'src/models/dynamo/request-person'
import { SQSStepFunctionController } from 'src/models/lambda'
import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV2ConsultarCNHV2RequestBody } from 'src/models/techmize/v2/consultar-cnh-v2/request-body'
import { TechmizeV2ConsultarCNHV2ResponseSuccess } from 'src/models/techmize/v2/consultar-cnh-v2/response'
import { TechmizeV2GetRequestErrorResponse, techmizeV2GetRequestProcessingResponseMessage } from 'src/models/techmize/v2/get-response-error'
import { TechmizeV2GetResponseRequestBody } from 'src/models/techmize/v2/get-response-request-body'
import s3PersonAnalysisAnswerThirdPartyPut from 'src/services/aws/s3/person-analysis/answer/third-party/put'
import sendTaskSuccess from 'src/services/aws/step-functions/send-task-success'
import techmizeV2GetResponse, { TechmizeV2GetResponseResponse } from 'src/services/techmize/v2/get-response'
import useCaseAnswerPersonAnalysis, { UseCaseAnswerPersonAnalysisParams } from 'src/use-cases/answer-person-analysis'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import getFinishedPersonAdapter from './get-finished-person-adapter'
import sendPresignedUrl from './send-presigned-url'
import validateBody from './validate-body'

const STAGE = getStringEnv('STAGE')
const REQUEST_INFORMATION_THIRD_PARTY = getStringEnv('REQUEST_INFORMATION_THIRD_PARTY')

export type TechmizeV2AnswerAnalysisCNHV2BodyValue = TechmizeV2ConsultarCNHV2RequestBody & TechmizeV2GetResponseRequestBody & {
  retry?: boolean
}

export type TechmizeV2AnswerAnalysisCNHV2Body = {
  person: {
    [PersonAnalysisTypeEnum.CNH_STATUS]: TechmizeV2AnswerAnalysisCNHV2BodyValue
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

const techmizeV2AnswerAnalysisCNHV2: SQSStepFunctionController<TechimzePersonSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on verify if techmize has response for cnh_v2',
  })
  const body = validateBody((message.body as TechmizeV2AnswerAnalysisCNHV2Body).person[PersonAnalysisTypeEnum.CNH_STATUS])

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

  const cnh_v2_result: TechmizeV2GetResponseResponse | TechmizeV2GetRequestErrorResponse = get_response_techimze
    ? await techmizeV2GetResponse({
      protocol: body.protocol,
    })
    : mockTechmizeV2AnswerAnalysisPersonCNHV2GetResponse

  if (cnh_v2_result.code === 0) {
    if (cnh_v2_result.message === techmizeV2GetRequestProcessingResponseMessage) {
      logger.info({
        message: `Response of protocol ${body.protocol} returned message waiting`,
        error: {
          ...cnh_v2_result,
        },
      })

      const return_body: TechmizeV2AnswerAnalysisCNHV2Body = {
        person: {
          [PersonAnalysisTypeEnum.CNH_STATUS]: {
            ...body,
            retry: true,
          },
        },
      }

      const task_success = [{
        messageAttributes: message.message_attributes,
        messageId: message.message_id,
        body: JSON.stringify(return_body),
        code: cnh_v2_result.code,
        message: cnh_v2_result.message,
        data: cnh_v2_result.data,
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
        ...cnh_v2_result,
      },
    })

    throw new ErrorHandler(`TECHMIZE: Response of protocol ${body.protocol} returned code 0`, 500)
  }

  logger.debug({
    message: 'Start on answer analysis cnh_v2',
  })

  const cnh_v2 = (cnh_v2_result as TechmizeV2ConsultarCNHV2ResponseSuccess).data.cnh_v2[0]

  const third_party = PersonThirdPartyEnum.TECHMIZE

  const s3_response_key = await s3PersonAnalysisAnswerThirdPartyPut({
    analysis_type: AnalysisTypeEnum.PERSON,
    body: JSON.stringify(cnh_v2),
    person_analysis_type: PersonAnalysisTypeEnum.CNH_STATUS,
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
    message: 'Finish on answer analysis cnh_v2',
    person_id,
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

export default techmizeV2AnswerAnalysisCNHV2
