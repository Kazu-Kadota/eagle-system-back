import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { Vehicle, VehicleBody, VehicleKey } from 'src/models/dynamo/vehicle'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
  createUpdateExpression,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES')

const updateVehicle = async (
  key: VehicleKey,
  body: Partial<VehicleBody>,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  const dynamoDocClient = DynamoDBDocumentClient.from(dynamodbClient)
  logger.debug({
    message: 'Updating vehicle info',
    vehicle_id: key.vehicle_id,
    plate: key.plate,
  })

  const now = new Date().toISOString()

  const update: Partial<Vehicle> = {
    ...key,
    ...body,
    updated_at: now,
  }

  const command = new UpdateCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES,
    Key: key,
    UpdateExpression: createUpdateExpression(update, Object.keys(key)),
    ExpressionAttributeNames: createExpressionAttributeNames(update),
    ExpressionAttributeValues: createExpressionAttributeValues(update, true),
    ConditionExpression: createConditionExpression(key, true),
  })

  await dynamoDocClient.send(command)
}

export default updateVehicle
