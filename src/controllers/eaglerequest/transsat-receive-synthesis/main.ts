import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { RequestStatusEnum, SynthesisThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { PersonRequest, PersonRequestKey } from 'src/models/dynamo/request-person'
import { SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import { FinishedVehicleRequest, VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { Controller } from 'src/models/lambda'
import updateFinishedRequestPerson from 'src/services/aws/dynamo/request/finished/person/update'
import updateFinishedRequestVehicle from 'src/services/aws/dynamo/request/finished/vehicle/update'
import updateRequestSynthesis from 'src/services/aws/dynamo/request/synthesis/update'
import s3SynthesisInformationThirdPartyPut from 'src/services/aws/s3/synthesis/answer/third-party/put'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'
import { gunzipSync } from 'zlib'

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

  const text_uncompressed = gunzipSync(body.texto).toString('base64')

  const request_id = body.metadata.request_id
  const synthesis_id = body.metadata.synthesis_id

  const synthesis_key: SynthesisRequestKey = {
    request_id,
    synthesis_id,
  }

  const s3_path = await s3SynthesisInformationThirdPartyPut({
    is_text_input: false,
    request_id,
    s3_client: s3Client,
    synthesis_id,
    third_party: SynthesisThirdPartyEnum.TRANSSAT,
    body: text_uncompressed,
  })

  const synthesis_body = await getRequestSynthesisAdapter({
    dynamodbClient,
    ...synthesis_key,
  })

  synthesis_body.text_output = s3_path
  synthesis_body.status = RequestStatusEnum.FINISHED

  await updateRequestSynthesis(synthesis_key, synthesis_body, dynamodbClient)

  if (body.metadata.person_id && body.metadata.person_request_id) {
    const finished_person_key: PersonRequestKey = {
      person_id: body.metadata.person_id,
      request_id: body.metadata.person_request_id,
    }

    const finished_person: Partial<PersonRequest> = {
      synthesis_id,
      synthesis_request_id: request_id,
    }

    await updateFinishedRequestPerson(finished_person_key, finished_person, dynamodbClient)
  }

  if (body.metadata.vehicle_id && body.metadata.vehicle_request_id) {
    const finished_vehicle_key: VehicleRequestKey = {
      vehicle_id: body.metadata.vehicle_id,
      request_id: body.metadata.vehicle_request_id,
    }

    const finished_vehicle: Partial<FinishedVehicleRequest> = {
      synthesis_id,
      synthesis_request_id: request_id,
    }

    await updateFinishedRequestVehicle(finished_vehicle_key, finished_vehicle, dynamodbClient)
  }

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
