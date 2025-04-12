import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { SynthesisRequestBody, SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
  createUpdateExpression,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS')

const updateRequestSynthesis = async (
  key: SynthesisRequestKey,
  body: Partial<SynthesisRequestBody>,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  const dynamoDocClient = DynamoDBDocumentClient.from(dynamodbClient)
  logger.debug({
    message: 'Updating synthesis in table',
    ...key,
  })

  const now = new Date().toISOString()

  const update = {
    ...key,
    ...body,
    updated_at: now,
  }

  const command = new UpdateCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS,
    Key: key,
    ConditionExpression: createConditionExpression(key, true),
    ExpressionAttributeNames: createExpressionAttributeNames(update),
    ExpressionAttributeValues: createExpressionAttributeValues(update, true),
    UpdateExpression: createUpdateExpression(update, Object.keys(key)),
  })

  await dynamoDocClient.send(command)
}

export default updateRequestSynthesis
