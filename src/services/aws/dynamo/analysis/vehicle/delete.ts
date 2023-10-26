import {
  DynamoDBClient,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { VehicleKey } from 'src/models/dynamo/vehicle'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES')

const deleteVehicle = async (
  key: VehicleKey,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Deleting vehicle from vehicle',
    vehicle_id: key.vehicle_id,
    plate: key.plate,
  })

  const command = new DeleteItemCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES,
    Key: marshall(key),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, true),
  })

  await dynamodbClient.send(command)
}

export default deleteVehicle
