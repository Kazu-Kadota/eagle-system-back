import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import {
  FinishedVehicleRequestBody,
  VehicleRequest,
  VehicleRequestKey,
} from 'src/models/dynamo/request-vehicle'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE')

const putFinishedRequestVehicle = async (
  key: VehicleRequestKey,
  body: FinishedVehicleRequestBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Registering finished request vehicle',
    plate: body.plate,
    owner_name: body.owner_name,
    company_name: body.company_name,
  })

  const now = new Date().toISOString()

  const put: VehicleRequest = {
    ...key,
    ...body,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE,
    Item: marshall(put),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putFinishedRequestVehicle
