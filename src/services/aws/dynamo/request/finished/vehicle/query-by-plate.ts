import {
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { PlateStateEnum } from 'src/models/dynamo/request-enum'
import { VehicleRequest } from 'src/models/dynamo/request-vehicle'
import {
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE')

export interface QueryFinishedRequestVehicleByPlateQuery {
  plate: string
  plate_state: PlateStateEnum
  company_name?: string
}

const queryFinishedRequestVehicleByPlate = async (
  query: QueryFinishedRequestVehicleByPlateQuery,
  dynamodbClient: DynamoDBClient,
): Promise<VehicleRequest[] | undefined> => {
  logger.debug({
    message: 'Querying finished request vehicle by plate',
    plate: query.plate,
  })

  let filterExpression

  if (query.company_name) {
    filterExpression = '#company_name = :company_name'
  }

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE,
    IndexName: 'plate-index',
    KeyConditionExpression: '#plate = :plate AND #plate_state = :plate_state',
    ExpressionAttributeNames: createExpressionAttributeNames(query),
    ExpressionAttributeValues: createExpressionAttributeValues(query),
    FilterExpression: filterExpression,
  })

  const { Items } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as VehicleRequest))

  return result
}

export default queryFinishedRequestVehicleByPlate
