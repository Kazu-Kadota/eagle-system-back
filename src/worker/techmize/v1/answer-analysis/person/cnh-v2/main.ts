import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SQSController } from 'src/models/lambda'

import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV1ConsultarCNHV2RequestBody } from 'src/models/techmize/v1/consultar-cnh-v2/request-body'
import techmizeV1ConsultarCNHV2 from 'src/services/techmize/v1/consultar-cnh-v2'
import useCaseAnswerPersonAnalysis, { UseCaseAnswerPersonAnalysisParams } from 'src/use-cases/answer-person-analysis'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

export type TechmizeV1AnswerAnalysisPersonCNHV2Body = {
  [PersonAnalysisTypeEnum.CNH_STATUS]: TechmizeV1ConsultarCNHV2RequestBody
}

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const techmizeV1AnswerAnalysisPersonCNHV2: SQSController<TechimzePersonSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on answer analysis person cnh-v2',
  })
  const body = validateBody((message.body as TechmizeV1AnswerAnalysisPersonCNHV2Body)[PersonAnalysisTypeEnum.CNH_STATUS])

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

  const cnh_v2_result = await techmizeV1ConsultarCNHV2({
    cpf: body.cpf,
  })

  const answer_person_analysis_params: UseCaseAnswerPersonAnalysisParams = {
    analysis_result: AnalysisResultEnum.REJECTED,
    from_db: false,
    person_id,
    request_id,
    analysis_info: JSON.stringify(cnh_v2_result.data.cnh_v2, null, 2),
  }

  await useCaseAnswerPersonAnalysis(answer_person_analysis_params, dynamodbClient)

  logger.info({
    message: 'Finish on answer analysis person cnh-v2',
    person_id,
  })

  return {
    success: true,
    statusCode: 200,
  }
}

export default techmizeV1AnswerAnalysisPersonCNHV2
