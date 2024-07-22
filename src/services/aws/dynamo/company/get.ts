import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { Company, CompanyKey } from 'src/models/dynamo/company'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_COMPANY = getStringEnv('DYNAMO_TABLE_EAGLEUSER_COMPANY')

const getCompany = async (
  key: CompanyKey,
  dynamodbClient: DynamoDBClient,
): Promise<Company | undefined> => {
  logger.debug({
    message: 'Getting company by company id',
    company_id: key.company_id,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_COMPANY,
    Key: marshall(key),
  })
  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as Company
}

export default getCompany
