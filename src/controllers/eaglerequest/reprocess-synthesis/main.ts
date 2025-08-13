import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { RequestStatusEnum, SynthesisThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import { Controller } from 'src/models/lambda'
import deleteRequestSynthesis from 'src/services/aws/dynamo/request/synthesis/delete'
import putRequestSynthesisFinished from 'src/services/aws/dynamo/request/synthesis/finished/put'
import s3SynthesisInformationThirdPartyPut from 'src/services/aws/s3/synthesis/answer/third-party/put'
import transsatGetSynthesis from 'src/services/transsat/get-synthesis'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import getRequestSynthesisAdapter from './get-request-synthesis-adapter'
import validateBodyReprocessSynthesis from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const s3Client = new S3Client({
  region: 'us-east-1',
  maxAttempts: 5,
})

const reprocessSynthesisController: Controller = async (req) => {
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyReprocessSynthesis(event_body)

  const request_id = body.request_id
  const synthesis_id = body.synthesis_id

  const synthesis_key: SynthesisRequestKey = {
    request_id,
    synthesis_id,
  }

  const synthesis_body = await getRequestSynthesisAdapter({
    dynamodbClient,
    ...synthesis_key,
  })

  const referencia = synthesis_body.third_party?.data.referencia

  const third_party_response = await transsatGetSynthesis({
    referencia,
  })

  const s3_path = await s3SynthesisInformationThirdPartyPut({
    is_text_input: false,
    request_id,
    s3_client: s3Client,
    synthesis_id,
    third_party: SynthesisThirdPartyEnum.TRANSSAT,
    body: JSON.stringify(third_party_response),
  })

  synthesis_body.text_output = s3_path
  synthesis_body.status = RequestStatusEnum.FINISHED
  synthesis_body.finished_at = new Date().toISOString()

  await putRequestSynthesisFinished(synthesis_key, synthesis_body, dynamodbClient)

  await deleteRequestSynthesis(synthesis_key, dynamodbClient)

  logger.info({
    message: 'Successfully reprocessed synthesis',
    ...synthesis_key,
  })

  return {
    body: {
      message: 'Successfully reprocessed synthesis',
      ...synthesis_key,
    },
  }
}

export default reprocessSynthesisController
