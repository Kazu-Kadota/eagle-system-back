import {
  AttributeValue,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { SynthesisRequest } from 'src/models/dynamo/request-synthesis'
import base64ToString from 'src/utils/base64-to-string'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import stringToBase64 from 'src/utils/string-to-base64'

const DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS')

export type QueryRequestSynthesisByCompany = {
  start_date: string
  final_date: string
  company_name: string
}

export type ExclusiveStartKey = {
  value?: Record<string, AttributeValue>
}

export type QueryRequestSynthesisByCompanyResponse = {
  result: SynthesisRequest[]
  last_evaluated_key?: string
  count: number
}

const queryRequestSynthesisByCompany = async (
  data: QueryRequestSynthesisByCompany,
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: string,
): Promise<QueryRequestSynthesisByCompanyResponse | undefined> => {
  const {
    start_date,
    final_date,
    company_name,
  } = data

  logger.debug({
    message: 'Querying synthesis by company name with date',
    start_date,
    final_date,
    company_name,
  })

  const exclusive_start_key = {} as ExclusiveStartKey

  if (last_evaluated_key) {
    exclusive_start_key.value = JSON.parse(base64ToString(last_evaluated_key))
  }

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS,
    IndexName: 'company-name-index',
    KeyConditionExpression: '#company_name = :company_name',
    ExpressionAttributeNames: {
      '#created_at': 'created_at',
      '#company_name': 'company_name',
    },
    ExpressionAttributeValues: {
      ':start_date': { S: start_date },
      ':final_date': { S: final_date },
      ':company_name': { S: company_name },
    },
    ExclusiveStartKey: exclusive_start_key.value,
    FilterExpression: '#created_at BETWEEN :start_date AND :final_date',
  })

  const { Items, LastEvaluatedKey, Count } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  if (Count === undefined) {
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
    count: Count,
  }
}

export default queryRequestSynthesisByCompany
