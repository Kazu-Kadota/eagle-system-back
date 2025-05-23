import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { SynthesisRequest } from 'src/models/dynamo/request-synthesis'
import base64ToString from 'src/utils/base64-to-string'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import stringToBase64 from 'src/utils/string-to-base64'

const DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS')

export type ScanSynthesisRequest = {
  company_name?: string
}

export type ScanSynthesisResponse = {
  result: SynthesisRequest[],
  last_evaluated_key?: string
}

export type ExclusiveStartKey = {
  value?: Record<string, AttributeValue>
}

const scanSynthesis = async (
  scan: ScanSynthesisRequest,
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: string,
): Promise<ScanSynthesisResponse | undefined> => {
  logger.debug({
    message: 'Scanning synthesis',
    company_name: scan.company_name || 'admin',
  })

  const exclusive_start_key = {} as ExclusiveStartKey

  if (last_evaluated_key) {
    exclusive_start_key.value = JSON.parse(base64ToString(last_evaluated_key))
  }

  const command = new ScanCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS,
    ExpressionAttributeNames: createExpressionAttributeNames(scan),
    ExpressionAttributeValues: createExpressionAttributeValues(scan),
    ExclusiveStartKey: exclusive_start_key.value,
    FilterExpression: createConditionExpression(scan, true),
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as SynthesisRequest))

  let last_evaluated_key_base64

  if (LastEvaluatedKey) {
    last_evaluated_key_base64 = stringToBase64(JSON.stringify(LastEvaluatedKey))
  }

  return {
    result,
    last_evaluated_key: last_evaluated_key_base64,
  }
}

export default scanSynthesis
