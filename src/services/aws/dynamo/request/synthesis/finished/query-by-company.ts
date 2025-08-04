import {
  AttributeValue,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { SynthesisRequest } from 'src/models/dynamo/request-synthesis'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED')

export type QueryRequestSynthesisFinishedByCompany = {
  start_date: string
  final_date: string
  company_name: string
}

export type QueryRequestSynthesisFinishedByCompanyResponse = {
  result: SynthesisRequest[]
  last_evaluated_key?: Record<string, AttributeValue>
  count: number
}

export type QueryRequestSynthesisFinishedByCompanyParams = {
  data: QueryRequestSynthesisFinishedByCompany
  dynamodbClient: DynamoDBClient
  last_evaluated_key?: Record<string, AttributeValue>
}

const queryRequestSynthesisFinishedByCompany = async ({
  data,
  dynamodbClient,
  last_evaluated_key,
}: QueryRequestSynthesisFinishedByCompanyParams): Promise<QueryRequestSynthesisFinishedByCompanyResponse | undefined> => {
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

  const command = new QueryCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED,
    IndexName: 'company-name-index',
    KeyConditionExpression: '#company_name = :company_name AND #created_at BETWEEN :start_date AND :final_date',
    ExpressionAttributeNames: {
      '#created_at': 'created_at',
      '#company_name': 'company_name',
    },
    ExpressionAttributeValues: {
      ':start_date': { S: start_date },
      ':final_date': { S: final_date },
      ':company_name': { S: company_name },
    },
    ExclusiveStartKey: last_evaluated_key,
  })

  const { Items, LastEvaluatedKey, Count } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  if (Count === undefined) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as SynthesisRequest))

  return {
    result,
    last_evaluated_key: LastEvaluatedKey,
    count: Count,
  }
}

export default queryRequestSynthesisFinishedByCompany
