import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'

import getS3AnalysisInfoAdapter, { GetS3AnalysisInfoAdapterParams } from './get-s3-analysis-info-adapter'
import getVehicleAdapter from './get-vehicle-adapter'
import validateVehicleParam from './validate-param'
import validateVehicleQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
})

const s3Client = new S3Client({
  region: 'us-east-1',
})

const getVehicleByRequestIdController = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  const { vehicle_id } = validateVehicleParam({ ...event.pathParameters })
  const { request_id } = validateVehicleQuery({ ...event.queryStringParameters })

  const request_vehicle_key: VehicleRequestKey = {
    vehicle_id,
    request_id,
  }

  const request_vehicle = await getVehicleAdapter(request_vehicle_key, user_info, dynamodbClient)

  if (request_vehicle.finished_at) {
    const get_s3_analysis_info_params: GetS3AnalysisInfoAdapterParams = {
      analysis_info: request_vehicle.analysis_info as string,
      s3_client: s3Client,
      third_party: !!request_vehicle.third_party,
    }

    const analysis_info = await getS3AnalysisInfoAdapter(get_s3_analysis_info_params)

    request_vehicle.analysis_info = analysis_info
  }

  if (user_info.user_type === UserGroupEnum.CLIENT) {
    delete request_vehicle.third_party
  }

  return {
    body: {
      message: 'Finish on get request vehicle',
      vehicle: request_vehicle,
    },
  }
}

export default getVehicleByRequestIdController
