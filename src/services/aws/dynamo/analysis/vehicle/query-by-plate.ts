import {
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { PlateStateEnum } from 'src/models/dynamo/request-enum'
import { Vehicle } from 'src/models/dynamo/vehicle'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES = getStringEnv('DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES')

const queryVehicleByPlate = async (
  plate: string,
  plate_state: PlateStateEnum,
  dynamodbClient: DynamoDBClient,
): Promise<Vehicle[] | undefined> => {
  logger.debug({
    message: 'Querying vehicle by plate',
    plate,
  })

  const key = {
    plate,
    plate_state,
  }

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEANALYSIS_VEHICLES,
    IndexName: 'plate-index',
    KeyConditionExpression: createConditionExpression(key, true),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
  })
  const { Items } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as Vehicle))

  return result
}

export default queryVehicleByPlate
