import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import getS3PersonAnalysisInfoAdapter, { GetS3PersonAnalysisInfoAdapterParams } from './get-s3-person-analysis-info-adapter'
import getS3VehicleAnalysisInfoAdapter, { GetS3VehicleAnalysisInfoAdapterParams } from './get-s3-vehicle-analysis-info-adapter'
import queryRequestPersonByDocumentAdapter from './query-request-person-by-document-adapter'
import queryRequestVehicleByPlateAdapter from './query-request-vehicle-by-plate-adapter'
import validatePath from './validate-path'
import validateQueryPerson from './validate-query-person'
import validateQueryVehicle from './validate-query-vehicle'

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
})

const s3Client = new S3Client({
  region: 'us-east-1',
})

const queryAnalysisByDocumentPlate = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  const { path_type } = validatePath({ ...event.pathParameters })

  if (path_type === 'person') {
    const query_person = validateQueryPerson({ ...event.queryStringParameters })

    const data = await queryRequestPersonByDocumentAdapter(query_person, dynamodbClient, user_info)

    for (const item of data) {
      if (item.finished_at) {
        // Is temporary
        const is_s3_path = item.analysis_info?.split('.')[1] === 'json'

        if (is_s3_path) {
          const get_s3_analysis_info_params: GetS3PersonAnalysisInfoAdapterParams = {
            analysis_info: item.analysis_info as string,
            s3_client: s3Client,
            third_party: !!item.third_party,
          }

          const analysis_info = await getS3PersonAnalysisInfoAdapter(get_s3_analysis_info_params)

          item.analysis_info = analysis_info
        }
      }
    }

    logger.info({
      message: 'Finish on get person request info with document',
    })

    return {
      body: {
        message: 'Finish on get person request info with document',
        data,
      },
    }
  }

  const query_vehicle = validateQueryVehicle({ ...event.queryStringParameters })

  const data = await queryRequestVehicleByPlateAdapter(query_vehicle, dynamodbClient, user_info)

  for (const item of data) {
    if (item.finished_at) {
      // Is temporary
      const is_s3_path = item.analysis_info?.split('.')[1] === 'json'

      if (is_s3_path) {
        const get_s3_analysis_info_params: GetS3VehicleAnalysisInfoAdapterParams = {
          analysis_info: item.analysis_info as string,
          s3_client: s3Client,
          third_party: !!item.third_party,
        }

        const analysis_info = await getS3VehicleAnalysisInfoAdapter(get_s3_analysis_info_params)

        item.analysis_info = analysis_info
      }
    }
  }

  logger.info({
    message: 'Finish on get vehicle request info with document',
  })

  return {
    body: {
      message: 'Finish on get vehicle request info with document',
      data,
    },
  }
}

export default queryAnalysisByDocumentPlate
