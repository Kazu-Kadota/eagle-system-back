import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { OperatorCompaniesAccess, OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS = getStringEnv('DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS')

const getOperatorCompaniesAccess = async (
  key: OperatorCompaniesAccessKey,
  dynamodbClient: DynamoDBClient,
): Promise<OperatorCompaniesAccess | undefined> => {
  logger.debug({
    message: 'Getting operator companies access',
    user_id: key.user_id,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS,
    Key: marshall(key),
  })

  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as OperatorCompaniesAccess
}

export default getOperatorCompaniesAccess
