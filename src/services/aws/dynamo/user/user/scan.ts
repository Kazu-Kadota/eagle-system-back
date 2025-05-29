import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { User } from 'src/models/dynamo/user'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_USER = getStringEnv('DYNAMO_TABLE_EAGLEUSER_USER')

export type ScanUserResponse = {
  result: User[],
  last_evaluated_key?: Record<string, AttributeValue>
}

const scanUser = async (
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<ScanUserResponse | undefined> => {
  logger.debug({
    message: 'Scanning user',
  })

  const command = new ScanCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_USER,
    ExclusiveStartKey: last_evaluated_key,
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as User))

  if (LastEvaluatedKey) {
    last_evaluated_key = LastEvaluatedKey
  }

  return {
    result,
    last_evaluated_key,
  }
}

export default scanUser
