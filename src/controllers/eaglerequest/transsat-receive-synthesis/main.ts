import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { RequestStatusEnum, SynthesisThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import { Controller } from 'src/models/lambda'
import updateRequestSynthesis from 'src/services/aws/dynamo/request/synthesis/update'
import s3SynthesisInformationThirdPartyPut from 'src/services/aws/s3/synthesis/answer/third-party/put'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import getRequestSynthesisAdapter from './get-request-synthesis-adapter'
import validateBodyReceiveSynthesis from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const s3Client = new S3Client({
  region: 'us-east-1',
  maxAttempts: 5,
})

const transsatReceiveSynthesisController: Controller = async (req) => {
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyReceiveSynthesis(event_body)

  const request_id = body.metadata.request_id
  const synthesis_id = body.metadata.synthesis_id

  const synthesis_key: SynthesisRequestKey = {
    request_id,
    synthesis_id,
  }

  const synthesis_body = await getRequestSynthesisAdapter({
    dynamodbClient,
    ...synthesis_key,
  })

  if (synthesis_body.status === RequestStatusEnum.FINISHED) {
    logger.warn({
      message: 'Synthesis already answered',
      synthesis_key,
    })

    throw new ErrorHandler('Síntese já respondido. Contatar o time da Eagle', 500)
  }

  const s3_path = await s3SynthesisInformationThirdPartyPut({
    is_text_input: false,
    request_id,
    s3_client: s3Client,
    synthesis_id,
    third_party: SynthesisThirdPartyEnum.TRANSSAT,
    body: JSON.stringify(body),
  })

  synthesis_body.text_output = s3_path
  synthesis_body.status = RequestStatusEnum.FINISHED
  synthesis_body.finished_at = new Date().toISOString()

  await updateRequestSynthesis(synthesis_key, synthesis_body, dynamodbClient)

  logger.info({
    message: 'Successfully received synthesis',
    ...synthesis_key,
  })

  return {
    body: {
      message: 'Successfully received synthesis',
      ...synthesis_key,
    },
  }
}

export default transsatReceiveSynthesisController
