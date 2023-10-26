import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { VehicleRequest } from 'src/models/dynamo/request-vehicle'
import { ReturnResponse } from 'src/models/lambda'
import queryVehicleByStatusProcessingWaiting, { QueryVehicleByStatusResponse, ScanVehicleRequest } from 'src/services/aws/dynamo/request/analysis/vehicle/scan'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const requestVehicles = async (user_info: UserInfoFromJwt): Promise<ReturnResponse<any>> => {
  let last_evaluated_key
  const scan: ScanVehicleRequest = {}
  const vehicles: VehicleRequest[] = []

  if (user_info.user_type === 'client') {
    scan.company_name = user_info.company_name
  }

  do {
    const query_result: QueryVehicleByStatusResponse | undefined = await queryVehicleByStatusProcessingWaiting(
      scan,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!query_result) {
      logger.info({
        message: 'Finish on get vehicles request info',
      })

      return {
        body: {
          message: 'Finish on query analysis vehicles',
          vehicles,
        },
      }
    }

    if (query_result?.result) {
      for (const item of query_result.result) {
        vehicles.push(item)
      }
    }

    last_evaluated_key = query_result.last_evaluated_key
  } while (last_evaluated_key)

  vehicles.sort(
    (r1, r2) => r1.created_at > r2.created_at
      ? 1
      : r1.created_at < r2.created_at
        ? -1
        : 0,
  )

  logger.info({
    message: 'Finish on get vehicles request info',
  })

  return {
    body: {
      message: 'Finish on query analysis vehicles',
      vehicles,
    },
  }
}

export default requestVehicles
