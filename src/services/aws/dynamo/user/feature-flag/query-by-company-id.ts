import {
  AttributeValue,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlag } from 'src/models/dynamo/feature-flag'
import {
  createConditionExpression,
  createExpressionAttributeNames,
  createExpressionAttributeValues,
} from 'src/utils/dynamo/expression'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG')

export type QueryByCompanyIdResponse = {
  last_evaluated_key?: Record<string, AttributeValue>
  feature_flag: FeatureFlag[]
}

export type QueryByCompanyId = {
  company_id: string
}

const queryFeatureFlag = async (
  query: QueryByCompanyId,
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<QueryByCompanyIdResponse | undefined> => {
  logger.debug({
    message: 'Querying feature flag by company_id',
    company_id: query.company_id,
  })

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG,
    KeyConditionExpression: createConditionExpression(query, true),
    ExpressionAttributeNames: createExpressionAttributeNames(query),
    ExpressionAttributeValues: createExpressionAttributeValues(query),
    ExclusiveStartKey: last_evaluated_key,
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as FeatureFlag))

  if (LastEvaluatedKey) {
    last_evaluated_key = LastEvaluatedKey
  }

  return {
    last_evaluated_key,
    feature_flag: result,
  }
}

export default queryFeatureFlag
