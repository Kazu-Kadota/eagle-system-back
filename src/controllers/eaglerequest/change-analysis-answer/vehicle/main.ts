import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { VehicleThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { Controller } from 'src/models/lambda'
import updateFinishedRequestVehicle from 'src/services/aws/dynamo/request/finished/vehicle/update'
import s3VehicleAnalysisAnswerPut from 'src/services/aws/s3/vehicle-analysis/answer/put'
import s3VehicleAnalysisAnswerThirdPartyPut from 'src/services/aws/s3/vehicle-analysis/answer/third-party/put'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import getFinishedVehicleAdapter from './get-finished-vehicle-adapter'
import validateBodyChangeAnalysisAnswerVehicle from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const s3Client = new S3Client({
  region: 'us-east-1',
  maxAttempts: 5,
})

const changeAnalysisAnswerVehicleController: Controller = async (req) => {
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyChangeAnalysisAnswerVehicle(event_body)

  const vehicle_key: VehicleRequestKey = {
    vehicle_id: body.vehicle_id,
    request_id: body.request_id,
  }

  const finished_vehicle = await getFinishedVehicleAdapter(vehicle_key, dynamodbClient)

  if (finished_vehicle.third_party) {
    await s3VehicleAnalysisAnswerThirdPartyPut({
      third_party: VehicleThirdPartyEnum.TECHMIZE,
      analysis_type: finished_vehicle.analysis_type,
      body: JSON.stringify(body.analysis_info),
      vehicle_analysis_type: finished_vehicle.vehicle_analysis_type,
      vehicle_id: finished_vehicle.vehicle_id,
      request_id: finished_vehicle.request_id,
      s3_client: s3Client,
    })
  } else {
    await s3VehicleAnalysisAnswerPut({
      analysis_type: finished_vehicle.analysis_type,
      body: JSON.stringify(body.analysis_info),
      vehicle_analysis_type: finished_vehicle.vehicle_analysis_type,
      vehicle_id: finished_vehicle.vehicle_id,
      request_id: finished_vehicle.request_id,
      s3_client: s3Client,
    })
  }

  await updateFinishedRequestVehicle(
    vehicle_key,
    {
      analysis_result: body.analysis_result,
      from_db: body.from_db,
    },
    dynamodbClient,
  )

  logger.info({
    message: 'Successfully changed vehicle`s analysis answer',
    vehicle_id: finished_vehicle.vehicle_id,
    request_id: finished_vehicle.request_id,
  })

  return {
    body: {
      message: 'Successfully changed vehicle`s analysis answer',
      vehicle_id: finished_vehicle.vehicle_id,
      request_id: finished_vehicle.request_id,
    },
  }
}

export default changeAnalysisAnswerVehicleController
