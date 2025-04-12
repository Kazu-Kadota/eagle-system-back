import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { RequestStatusEnum } from 'src/models/dynamo/request-enum'
import { SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { Controller } from 'src/models/lambda'
import s3SynthesisInformationThirdPartyGet from 'src/services/aws/s3/synthesis/answer/third-party/get'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import getRequestSynthesisAdapter from './get-request-synthesis-adapter'
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

  const s3_key = `${synthesis_id}/${request_id}/${synthesis.third_party}/text_output.json`

  const text_output = await s3SynthesisInformationThirdPartyGet({
    key: s3_key,
    s3_client: s3Client,
  })

  synthesis.text_output = text_output

  if (user_info.user_type === UserGroupEnum.CLIENT) {
    delete synthesis.third_party
  }

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
