import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { SynthesisRequest } from 'src/models/dynamo/request-synthesis'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED')

export type ScanRequestSynthesisFinished = {
  company_name?: string
}

export type ScanRequestSynthesisFinishedResponse = {
  result: SynthesisRequest[],
  last_evaluated_key?: Record<string, AttributeValue>
}

const scanRequestSynthesisFinished = async (
  scan: ScanRequestSynthesisFinished,
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<ScanRequestSynthesisFinishedResponse | undefined> => {
  logger.debug({
    message: 'Scanning synthesis',
    company_name: scan.company_name || 'admin',
  })

  const command = new ScanCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED,
    ExpressionAttributeNames: createExpressionAttributeNames(scan),
    ExpressionAttributeValues: createExpressionAttributeValues(scan),
    ExclusiveStartKey: last_evaluated_key,
    FilterExpression: createConditionExpression(scan, true),
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as SynthesisRequest))

  return {
    result,
    last_evaluated_key: LastEvaluatedKey,
  }
}

export default scanRequestSynthesisFinished
