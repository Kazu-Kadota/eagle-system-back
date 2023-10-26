import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Vehicle, VehicleBody, VehicleKey } from 'src/models/dynamo/vehicle'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES')

const putVehicle = async (
  key: VehicleKey,
  data: VehicleBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Registering vehicle into table',
    vehicle_id: key.vehicle_id,
    plate: key.plate,
  })

  const now = new Date().toISOString()

  const put: Vehicle = {
    ...key,
    ...data,
    created_at: now,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES,
    Item: marshall(put),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putVehicle
