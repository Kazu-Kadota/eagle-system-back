import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { mockTechmizeV2AnswerAnalysisPersonCNHV2GetResponse } from 'src/mock/techmize/v2/answer-analysis/person/cnh-v2/get-response'
import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SQSStepFunctionController } from 'src/models/lambda'
import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV2ConsultarCNHV2RequestBody } from 'src/models/techmize/v2/consultar-cnh-v2/request-body'
import { TechmizeV2ConsultarCNHV2ResponseSuccess } from 'src/models/techmize/v2/consultar-cnh-v2/response'
import { TechmizeV2GetRequestErrorResponse, techmizeV2GetRequestProcessingResponseMessage } from 'src/models/techmize/v2/get-response-error'
import { TechmizeV2GetResponseRequestBody } from 'src/models/techmize/v2/get-response-request-body'
import sendTaskSuccess from 'src/services/aws/step-functions/send-task-success'
import techmizeV2GetResponse, { TechmizeV2GetResponseResponse } from 'src/services/techmize/v2/get-response'
import useCaseAnswerPersonAnalysis, { UseCaseAnswerPersonAnalysisParams } from 'src/use-cases/answer-person-analysis'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

const STAGE = getStringEnv('STAGE')

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

  const cnh_v2_result: TechmizeV2GetResponseResponse | TechmizeV2GetRequestErrorResponse = STAGE === 'prd'
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

  const cnh_v2 = (cnh_v2_result as TechmizeV2ConsultarCNHV2ResponseSuccess).data.cnh_v2

  const answer_person_analysis_params: UseCaseAnswerPersonAnalysisParams = {
    analysis_result: AnalysisResultEnum.REJECTED,
    from_db: false,
    person_id,
    request_id,
    analysis_info: JSON.stringify(cnh_v2, null, 2),
  }

  await useCaseAnswerPersonAnalysis(answer_person_analysis_params, dynamodbClient)

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
