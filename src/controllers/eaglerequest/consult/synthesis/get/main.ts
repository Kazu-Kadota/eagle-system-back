import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { RequestStatusEnum } from 'src/models/dynamo/request-enum'
import { SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { Controller } from 'src/models/lambda'
import s3SynthesisInformationThirdPartyGet from 'src/services/aws/s3/synthesis/answer/third-party/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import getFeatureFlagAdapter from './get-feature-flag-adapter'
import getRequestSynthesisAdapter from './get-request-synthesis-adapter'
import queryCompanyByNameAdapter from './query-company-adapter'
import validateSynthesisQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
})

const s3Client = new S3Client({
  region: 'us-east-1',
})

const getSynthesisController: Controller = async (event) => {
  const user_info = event.user_info as UserInfoFromJwt

  const { request_id, synthesis_id } = validateSynthesisQuery({ ...event.queryStringParameters })

  const request_synthesis_key: SynthesisRequestKey = {
    synthesis_id,
    request_id,
  }

  const synthesis = await getRequestSynthesisAdapter({
    ...request_synthesis_key,
    dynamodbClient,
    user_info,
  })

  if (synthesis.status !== RequestStatusEnum.FINISHED) {
    logger.info({
      message: 'Synthesis in process',
      request_id,
      synthesis_id,
    })

    return {
      body: {
        message: 'Synthesis in process',
        request_id,
        synthesis_id,
      },
    }
  }

  if (user_info.user_type === UserGroupEnum.CLIENT) {
    const company = await queryCompanyByNameAdapter(synthesis.company_name, dynamodbClient)

    const feature_flag = await getFeatureFlagAdapter(company.company_id, dynamodbClient)

    const now = new Date()

    const diff_date = (now.getTime() - new Date(synthesis.finished_at as string).getTime()) / 1000 / 60 / 60 / 24

    if (feature_flag.config.range_date_limit > diff_date) {
      logger.warn({
        message: 'Range data limit exceed for this company',
        now,
        finished_at: synthesis.finished_at,
        diff_date,
        range_date_limit: feature_flag.config.range_date_limit,
      })

      throw new ErrorHandler('Não é possível verificar síntese entre datas maiores de ' + feature_flag.config.range_date_limit + ' dias', 400)
    }

    delete synthesis.third_party
  }

  const s3_key_output = `${synthesis_id}/${request_id}/${synthesis.third_party?.company}/text_output.json`

  const text_output = await s3SynthesisInformationThirdPartyGet({
    key: s3_key_output,
    s3_client: s3Client,
  })

  synthesis.text_output = text_output

  const s3_key_input = `${synthesis_id}/${request_id}/${synthesis.third_party?.company}/text_input.json`

  const text_input = await s3SynthesisInformationThirdPartyGet({
    key: s3_key_input,
    s3_client: s3Client,
  })

  synthesis.text_input = text_input as string

  logger.info({
    message: 'Finish on get synthesis info',
    request_id,
    synthesis_id,
  })

  return {
    body: {
      message: 'Finish on get synthesis info',
      synthesis,
    },
  }
}

export default getSynthesisController
