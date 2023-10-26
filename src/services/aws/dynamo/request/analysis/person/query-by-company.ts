import {
  AttributeValue,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { PersonRequest } from 'src/models/dynamo/request-person'
import base64ToString from 'src/utils/base64-to-string'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import stringToBase64 from 'src/utils/string-to-base64'

const DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON')

export interface QueryRequestPersonByCompany {
  start_date: string
  final_date: string
  company_name: string
}

export interface ExclusiveStartKey {
  value?: Record<string, AttributeValue>
}

export interface QueryRequestPersonByCompanyResponse {
  result: PersonRequest[]
  last_evaluated_key?: string
  count: number
}

const queryRequestPersonByCompany = async (
  data: QueryRequestPersonByCompany,
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: string,
): Promise<QueryRequestPersonByCompanyResponse | undefined> => {
  const {
    start_date,
    final_date,
    company_name,
  } = data

  logger.debug({
    message: 'Querying requested person by company name with date',
    start_date,
    final_date,
    company_name,
  })

  const exclusive_start_key = {} as ExclusiveStartKey

  if (last_evaluated_key) {
    exclusive_start_key.value = JSON.parse(base64ToString(last_evaluated_key))
  }

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_ANALYSIS_PERSON,
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

  const result = Items.map((item) => (unmarshall(item) as PersonRequest))

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

export default queryRequestPersonByCompany
