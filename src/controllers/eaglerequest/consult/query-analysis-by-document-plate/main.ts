import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import queryRequestPersonByDocumentAdapter from './query-request-person-by-document-adapter'
import queryRequestVehicleByPlateAdapter from './query-request-vehicle-by-plate-adapter'
import validatePath from './validate-path'
import validateQueryPerson from './validate-query-person'
import validateQueryVehicle from './validate-query-vehicle'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const queryAnalysisByDocumentPlate = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  const { path_type } = validatePath({ ...event.pathParameters })

  if (path_type === 'person') {
    const query_person = validateQueryPerson({ ...event.queryStringParameters })

    const data = await queryRequestPersonByDocumentAdapter(query_person, dynamodbClient, user_info)

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
