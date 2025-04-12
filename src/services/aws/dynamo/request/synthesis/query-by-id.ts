import {
  DynamoDBClient,
  QueryCommand,
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

const DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS')

export type QueryRequestSynthesisByIdQuery = {
  synthesis_id: string
}

const queryRequestSynthesisById = async (
  query: QueryRequestSynthesisByIdQuery,
  dynamodbClient: DynamoDBClient,
): Promise<SynthesisRequest[] | undefined> => {
  logger.debug({
    message: 'Querying request synthesis by synthesis_id',
    synthesis_id: query.synthesis_id,
  })

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS,
    IndexName: 'synthesis-id-index',
    KeyConditionExpression: createConditionExpression(query, true),
    ExpressionAttributeNames: createExpressionAttributeNames(query),
    ExpressionAttributeValues: createExpressionAttributeValues(query),
  })

  const { Items } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as SynthesisRequest))

  return result
}

export default queryRequestSynthesisById
