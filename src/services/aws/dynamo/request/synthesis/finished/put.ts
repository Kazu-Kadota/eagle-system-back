import {
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { SynthesisRequest, SynthesisRequestBody, SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED')

const putRequestSynthesisFinished = async (
  key: SynthesisRequestKey,
  body: SynthesisRequestBody,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  logger.debug({
    message: 'Registering finished synthesis',
    analysis_type: body.analysis_type,
    synthesis_id: key.synthesis_id,
    request_id: key.request_id,
  })

  const now = new Date().toISOString()

  const put: SynthesisRequest = {
    ...key,
    ...body,
    created_at: now,
    updated_at: now,
  }

  const command = new PutItemCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED,
    Item: marshall(put),
    ExpressionAttributeNames: createExpressionAttributeNames(key),
    ExpressionAttributeValues: createExpressionAttributeValues(key),
    ConditionExpression: createConditionExpression(key, false),
  })

  await dynamodbClient.send(command)
}

export default putRequestSynthesisFinished
