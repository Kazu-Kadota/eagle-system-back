import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { Vehicle, VehicleKey } from 'src/models/dynamo/vehicle'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES')

const getVehicle = async (
  key: VehicleKey,
  dynamodbClient: DynamoDBClient,
): Promise<Vehicle | undefined> => {
  logger.debug({
    message: 'Getting vehicle by vehicle id',
    vehicle_id: key.vehicle_id,
    plate: key.plate,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES,
    Key: marshall(key),
  })
  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as Vehicle
}

export default getVehicle
