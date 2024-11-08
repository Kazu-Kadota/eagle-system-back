import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SQSController } from 'src/models/lambda'

import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV1ConsultarProcessosRequestBody } from 'src/models/techmize/v1/consultar-processos/request-body'
import { techmizeV1SuccessErrorResponse } from 'src/models/techmize/v1/error'
import techmizeV1ConsultarProcessos from 'src/services/techmize/v1/consultar-processos'
import useCaseAnswerPersonAnalysis, { UseCaseAnswerPersonAnalysisParams } from 'src/use-cases/answer-person-analysis'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

export type TechmizeV1AnswerAnalysisPersonProcessBody = {
  person: {
    [PersonAnalysisTypeEnum.PROCESS]: TechmizeV1ConsultarProcessosRequestBody
  }
}

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const techmizeV1AnswerAnalysisPersonProcess: SQSController<TechimzePersonSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on answer analysis person process',
  })
  const body = validateBody((message.body as TechmizeV1AnswerAnalysisPersonProcessBody).person[PersonAnalysisTypeEnum.PROCESS])

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

  const process_result = await techmizeV1ConsultarProcessos({
    cpf: body.cpf,
  })

  const process = process_result.data.processos

  if (process === techmizeV1SuccessErrorResponse) {
    logger.warn({
      message: 'TECHMIZE: Returned success on request process result, but received error instead',
      process_result,
    })

    throw new ErrorHandler('TECHMIZE: Returned success on request process result, but received error instead', 500)
  }

  const answer_person_analysis_params: UseCaseAnswerPersonAnalysisParams = {
    analysis_result: AnalysisResultEnum.REJECTED,
    from_db: false,
    person_id,
    request_id,
    analysis_info: JSON.stringify(process, null, 2),
  }

  await useCaseAnswerPersonAnalysis(answer_person_analysis_params, dynamodbClient)

  logger.info({
    message: 'Finish on answer analysis person process',
    person_id,
  })

  return {
    success: true,
    statusCode: 200,
  }
}

export default techmizeV1AnswerAnalysisPersonProcess
