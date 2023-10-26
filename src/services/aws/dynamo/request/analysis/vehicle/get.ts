import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { VehicleRequest, VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_VEHICLE = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_VEHICLE')

const getRequestVehicle = async (
  key: VehicleRequestKey,
  dynamodbClient: DynamoDBClient,
): Promise<VehicleRequest | undefined> => {
  logger.debug({
    message: 'Getting vehicle',
    request_id: key.request_id,
    vehicle_id: key.vehicle_id,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_VEHICLE,
    Key: marshall(key),
  })

  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as VehicleRequest
}

export default getRequestVehicle
