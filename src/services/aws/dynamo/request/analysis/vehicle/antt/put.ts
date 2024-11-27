import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { VehicleAnalysisTypeRequest, VehicleRequestAnalysisTypeBody } from 'src/models/dynamo/request-vehicle-analysis-type'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_VEHICLE = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_VEHICLE')

const putRequestVehicleANTT = async (
  key: VehicleRequestKey,
  body: VehicleRequestAnalysisTypeBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Registering request vehicle antt',
    company_name: body.company_name,
    plate: body.plate,
  })

  const now = new Date().toISOString()

  const put: VehicleAnalysisTypeRequest = {
    ...key,
    ...body,
    created_at: now,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_VEHICLE,
    Item: marshall(put),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putRequestVehicleANTT
