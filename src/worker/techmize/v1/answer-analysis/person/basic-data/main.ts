import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SQSController } from 'src/models/lambda'

import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody } from 'src/models/techmize/v1/consultar-dados-basicos-pessoa-fisica/request-body'
import techmizeV1ConsultarDadosBasicosPessoaFisica from 'src/services/techmize/v1/consultar-dados-basicos-pessoa-fisica'
import useCaseAnswerPersonAnalysis, { UseCaseAnswerPersonAnalysisParams } from 'src/use-cases/answer-person-analysis'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import validateBody from './validate-body'

export type TechmizeV1AnswerAnalysisPersonBasicDataBody = {
  person: {
    [PersonAnalysisTypeEnum.BASIC_DATA]: TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody
  }
}

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const techmizeV1AnswerAnalysisPersonBasicData: SQSController<TechimzePersonSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on answer analysis person basic data',
  })
  const body = validateBody((message.body as TechmizeV1AnswerAnalysisPersonBasicDataBody).person[PersonAnalysisTypeEnum.BASIC_DATA])

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

  const person_basic_data_result = await techmizeV1ConsultarDadosBasicosPessoaFisica({
    cpf: body.cpf,
  })

  const answer_person_analysis_params: UseCaseAnswerPersonAnalysisParams = {
    analysis_result: AnalysisResultEnum.REJECTED,
    from_db: false,
    person_id,
    request_id,
    analysis_info: JSON.stringify(person_basic_data_result.data.dados_cadastrais, null, 2),
  }

  await useCaseAnswerPersonAnalysis(answer_person_analysis_params, dynamodbClient)

  logger.info({
    message: 'Finish on answer analysis person basic data',
    person_id,
  })

  return {
    success: true,
    statusCode: 200,
  }
}

export default techmizeV1AnswerAnalysisPersonBasicData
