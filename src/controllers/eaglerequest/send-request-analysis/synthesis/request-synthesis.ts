import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { AnalysisTypeEnum, RequestStatusEnum, SynthesisThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { PersonRequest, PersonRequestKey } from 'src/models/dynamo/request-person'
import { SynthesisRequestBody, SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import { VehicleRequest, VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import updateFinishedRequestPerson from 'src/services/aws/dynamo/request/finished/person/update'
import updateFinishedRequestVehicle from 'src/services/aws/dynamo/request/finished/vehicle/update'
import putRequestSynthesis from 'src/services/aws/dynamo/request/synthesis/put'
import s3SynthesisInformationThirdPartyPut from 'src/services/aws/s3/synthesis/answer/third-party/put'
import transsatSendRequestSynthesis from 'src/services/transsat/send-request-synthesis'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'
import { v4 as uuid } from 'uuid'
import { gunzipSync } from 'zlib'

import getPersonAdapter from './get-person-adapter'
import getVehicleAdapter from './get-vehicle-adapter'

export type SynthesisAnalysisResponse = {
  request_id: string
  synthesis_id: string
  status: RequestStatusEnum
}

export type SynthesisAnalysisRequest = {
  analysis_type: AnalysisTypeEnum
  company_name: string
  document: string
  dynamodbClient: DynamoDBClient
  person_id?: string
  person_request_id?: string
  s3_client: S3Client
  text: string
  vehicle_id?: string
  vehicle_request_id?: string
  user_info: UserInfoFromJwt
}

const requestSynthesis = async ({
  analysis_type,
  company_name,
  document,
  dynamodbClient,
  text,
  person_id,
  person_request_id,
  s3_client,
  user_info,
  vehicle_id,
  vehicle_request_id,
}: SynthesisAnalysisRequest): Promise<SynthesisAnalysisResponse> => {
  logger.debug({
    message: 'Requested synthesis',
    analysis_type,
    company_name,
    user_id: user_info.user_id,
  })

  const request_id = uuid()
  const synthesis_id = uuid()

  // @ts-ignore-next-line
  const text_uncompressed = gunzipSync(Buffer.from(text, 'base64')).toString('utf8')

  let person: PersonRequest | undefined
  let vehicle: VehicleRequest | undefined

  if (person_id && person_request_id) {
    const person_response = await getPersonAdapter(
      {
        person_id,
        request_id: person_request_id,
      },
      user_info,
      dynamodbClient,
    )

    person = person_response
  }

  if (vehicle_id && vehicle_request_id) {
    const vehicle_response = await getVehicleAdapter(
      {
        vehicle_id,
        request_id: vehicle_request_id,
      },
      user_info,
      dynamodbClient,
    )

    vehicle = vehicle_response
  }

  const transsat_data = await transsatSendRequestSynthesis({
    texto: text_uncompressed,
    metadata: {
      request_id,
      synthesis_id,
      person_id,
      person_request_id,
      vehicle_id,
      vehicle_request_id,
    },
  })

  const s3_path = await s3SynthesisInformationThirdPartyPut({
    is_text_input: true,
    request_id,
    s3_client,
    synthesis_id,
    third_party: SynthesisThirdPartyEnum.TRANSSAT,
    body: text_uncompressed,
  })

  const data_request_synthesis: SynthesisRequestBody = {
    analysis_type: AnalysisTypeEnum.SYNTHESIS,
    company_name,
    document,
    status: RequestStatusEnum.PROCESSING,
    text_input: s3_path,
    user_id: user_info.user_id,
    person_id,
    person_request_id,
    third_party: {
      company: SynthesisThirdPartyEnum.TRANSSAT,
      data: transsat_data,
    },
    vehicle_id,
    vehicle_request_id,
  }

  const request_synthesis_data = removeEmpty(data_request_synthesis)

  const request_synthesis_key: SynthesisRequestKey = {
    request_id,
    synthesis_id,
  }

  if (person) {
    const person_key: PersonRequestKey = {
      person_id: person_id!,
      request_id: person_request_id!,
    }

    const person_update: Partial<PersonRequest> = {
      synthesis_id,
      synthesis_request_id: request_id,
    }

    await updateFinishedRequestPerson(person_key, person_update, dynamodbClient)
  }

  if (vehicle) {
    const vehicle_key: VehicleRequestKey = {
      vehicle_id: vehicle_id!,
      request_id: vehicle_request_id!,
    }

    const vehicle_update: Partial<VehicleRequest> = {
      synthesis_id,
      synthesis_request_id: request_id,
    }

    await updateFinishedRequestVehicle(vehicle_key, vehicle_update, dynamodbClient)
  }

  await putRequestSynthesis(request_synthesis_key, request_synthesis_data, dynamodbClient)

  return {
    request_id,
    status: RequestStatusEnum.PROCESSING,
    synthesis_id,
  }
}

export default requestSynthesis
