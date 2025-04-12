import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { FinishedVehicleRequest, VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
  createUpdateExpression,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE')

const updateFinishedRequestVehicle = async (
  key: VehicleRequestKey,
  body: Partial<FinishedVehicleRequest>,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  const dynamoDocClient = DynamoDBDocumentClient.from(dynamodbClient)
  logger.debug({
    message: 'Updating finished vehicle in table',
    ...key,
  })

  const now = new Date().toISOString()

  const update = {
    ...key,
    ...body,
    updated_at: now,
  }

  const command = new UpdateCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE,
    Key: key,
    ConditionExpression: createConditionExpression(key, true),
    ExpressionAttributeNames: createExpressionAttributeNames(update),
    ExpressionAttributeValues: createExpressionAttributeValues(update, true),
    UpdateExpression: createUpdateExpression(update, Object.keys(key)),
  })

  await dynamoDocClient.send(command)
}

export default updateFinishedRequestVehicle
