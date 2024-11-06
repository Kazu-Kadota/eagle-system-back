import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SQSController } from 'src/models/lambda'

import { TechimzeSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import answerPersonAnalysis, { AnswerPersonAnalysis } from 'src/use-cases/answer-person-analysis'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import validateBody from './validate-body'
import { TechmizeV1ConsultarCNHRequestBody } from 'src/models/techmize/v1/consultar-cnh/request-body'
import techmizeV1ConsultarCNH from 'src/services/techmize/v1/consultar-cnh'

export type TechmizeV1AnswerAnalysisCNHBody = {
  [PersonAnalysisTypeEnum.CNH_BASIC]: TechmizeV1ConsultarCNHRequestBody
}

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const techmizeV1AnswerAnalysisCNH: SQSController<TechimzeSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on answer analysis cnh',
  })
  const body = validateBody((message.body as TechmizeV1AnswerAnalysisCNHBody)[PersonAnalysisTypeEnum.CNH_BASIC])

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

  const cnh_result = await techmizeV1ConsultarCNH({
    cpf: body.cpf,
  })

  const answer_person_analysis_params: AnswerPersonAnalysis = {
    analysis_result: AnalysisResultEnum.REJECTED,
    from_db: false,
    person_id,
    request_id,
    analysis_info: JSON.stringify(cnh_result.data.cnh, null, 2),
  }

  await answerPersonAnalysis(answer_person_analysis_params, dynamodbClient)

  logger.info({
    message: 'Finish on answer analysis cnh',
    person_id,
  })

  return {
    success: true,
    statusCode: 200,
  }
}

export default techmizeV1AnswerAnalysisCNH