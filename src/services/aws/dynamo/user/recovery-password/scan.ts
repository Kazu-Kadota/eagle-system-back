import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { RecoveryPassword } from 'src/models/dynamo/users/recovery-password'
import base64ToString from 'src/utils/base64-to-string'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import stringToBase64 from 'src/utils/string-to-base64'

const DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON')

export interface ScanRecoveryPasswordResponse {
  result: RecoveryPassword[],
  last_evaluated_key?: string
}

export interface ExclusiveStartKey {
  value?: Record<string, AttributeValue>
}

const scanRecoveryPassword = async (
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: string,
): Promise<ScanRecoveryPasswordResponse | undefined> => {
  logger.debug({
    message: 'Scanning recovery password',
  })

  const exclusive_start_key = {} as ExclusiveStartKey

  if (last_evaluated_key) {
    exclusive_start_key.value = JSON.parse(base64ToString(last_evaluated_key))
  }

  const command = new ScanCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON,
    ExclusiveStartKey: exclusive_start_key.value,
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as RecoveryPassword))

  let last_evaluated_key_base64

  if (LastEvaluatedKey) {
    last_evaluated_key_base64 = stringToBase64(JSON.stringify(LastEvaluatedKey))
  }

  return {
    result,
    last_evaluated_key: last_evaluated_key_base64,
  }
}

export default scanRecoveryPassword
