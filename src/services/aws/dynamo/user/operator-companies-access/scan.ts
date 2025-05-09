import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { OperatorCompaniesAccess } from 'src/models/dynamo/users/operator-companies-access'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS = getStringEnv('DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS')

export type ScanOperatorCompaniesAccessResponse = {
  result: OperatorCompaniesAccess[],
  last_evaluated_key?: Record<string, AttributeValue>
}

const scanOperatorCompaniesAccess = async (
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<ScanOperatorCompaniesAccessResponse | undefined> => {
  logger.debug({
    message: 'Scanning operator companies access',
  })

  const command = new ScanCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS,
    ExclusiveStartKey: last_evaluated_key,
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as OperatorCompaniesAccess))

  if (LastEvaluatedKey) {
    last_evaluated_key = LastEvaluatedKey
  }

  return {
    result,
    last_evaluated_key,
  }
}

export default scanOperatorCompaniesAccess
