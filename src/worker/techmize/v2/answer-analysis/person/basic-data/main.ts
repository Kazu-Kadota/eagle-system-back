import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { S3Client } from '@aws-sdk/client-s3'
import { mockTechmizeV2AnswerAnalysisPersonBasicDataGetResponse } from 'src/mock/techmize/v2/answer-analysis/person/basic-data/get-response'
import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { AnalysisTypeEnum, PersonAnalysisTypeEnum, PersonThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { PersonRequestKey } from 'src/models/dynamo/request-person'
import { SQSStepFunctionController } from 'src/models/lambda'
import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import { TechmizeV2ConsultarDadosBasicosPessoaFisicaRequestBody } from 'src/models/techmize/v2/consultar-dados-basicos-pessoa-fisica/request-body'
import { TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseSuccess } from 'src/models/techmize/v2/consultar-dados-basicos-pessoa-fisica/response'
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

export type TechmizeV2AnswerAnalysisPersonBasicDataBodyValue = TechmizeV2ConsultarDadosBasicosPessoaFisicaRequestBody & TechmizeV2GetResponseRequestBody & {
  retry?: boolean
}

export type TechmizeV2AnswerAnalysisPersonBasicDataBody = {
  person: {
    [PersonAnalysisTypeEnum.BASIC_DATA]: TechmizeV2AnswerAnalysisPersonBasicDataBodyValue
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

const STAGE = getStringEnv('STAGE')
const REQUEST_INFORMATION_THIRD_PARTY = getStringEnv('REQUEST_INFORMATION_THIRD_PARTY')

const techmizeV2AnswerAnalysisPersonBasicData: SQSStepFunctionController<TechimzePersonSQSReceivedMessageAttributes> = async (message) => {
  logger.debug({
    message: 'Start on verify if techmize has response for person basic data',
  })
  const body = validateBody((message.body as TechmizeV2AnswerAnalysisPersonBasicDataBody).person[PersonAnalysisTypeEnum.BASIC_DATA])

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

  const person_basic_data_result: TechmizeV2GetResponseResponse | TechmizeV2GetRequestErrorResponse = get_response_techimze
    ? await techmizeV2GetResponse({
      protocol: body.protocol,
    })
    : mockTechmizeV2AnswerAnalysisPersonBasicDataGetResponse

  if (person_basic_data_result.code === 0) {
    if (person_basic_data_result.message === techmizeV2GetRequestProcessingResponseMessage) {
      logger.info({
        message: `TECHMIZE: Response of protocol ${body.protocol} returned message waiting`,
        error: {
          ...person_basic_data_result,
        },
      })

      const return_body: TechmizeV2AnswerAnalysisPersonBasicDataBody = {
        person: {
          [PersonAnalysisTypeEnum.BASIC_DATA]: {
            ...body,
            retry: true,
          },
        },
      }

      const task_success = [{
        messageAttributes: message.message_attributes,
        messageId: message.message_id,
        body: JSON.stringify(return_body),
        code: person_basic_data_result.code,
        message: person_basic_data_result.message,
        data: person_basic_data_result.data,
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
        ...person_basic_data_result,
      },
    })

    throw new ErrorHandler(`TECHMIZE: Response of protocol ${body.protocol} returned code 0`, 500)
  }

  logger.debug({
    message: 'Start on answer analysis person basic data',
  })

  const dados_cadastrais = (person_basic_data_result as TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseSuccess).data.dados_cadastrais[0]

  const third_party = PersonThirdPartyEnum.TECHMIZE

  const s3_response_key = await s3PersonAnalysisAnswerThirdPartyPut({
    analysis_type: AnalysisTypeEnum.PERSON,
    body: JSON.stringify(dados_cadastrais),
    person_analysis_type: PersonAnalysisTypeEnum.BASIC_DATA,
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

  await sendTaskSuccess({
    output: JSON.stringify([{
      message: `TECHMIZE: Response of protocol ${body.protocol} returned code 1`,
    }]),
    sfnClient: message.sfnClient,
    task_token: message.taskToken,
  })

  logger.info({
    message: 'Finish on answer analysis person basic data',
    person_id,
  })

  return {
    success: true,
    statusCode: 200,
  }
}

export default techmizeV2AnswerAnalysisPersonBasicData
