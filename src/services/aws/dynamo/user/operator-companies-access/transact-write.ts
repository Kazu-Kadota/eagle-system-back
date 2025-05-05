import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { splitEvery } from 'ramda'
import {
  OperatorCompaniesAccessBody,
  OperatorCompaniesAccessKey,
} from 'src/models/dynamo/users/operator-companies-access'
import { transactWriteItems, TransactWriteOperatorsMap } from 'src/utils/dynamo/transact-write'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import sleep from 'src/utils/sleep'

const DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS = getStringEnv('DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS')

export type TransactWriteOperatorCompaniesAccessParams = {
  operators: Array<OperatorCompaniesAccessKey & Partial<OperatorCompaniesAccessBody>>
  operation: TransactWriteOperatorsMap,
  dynamodbClient: DynamoDBClient,
}

const transactWriteOperatorCompaniesAccess = async ({
  operators,
  operation,
  dynamodbClient,
}: TransactWriteOperatorCompaniesAccessParams): Promise<void> => {
  logger.debug({
    message: 'TransactWrite to operator companies access',
    operation,
  })

  for (const operators_25 of splitEvery(25, operators)) {
    const items = []

    for (const operator of operators_25) {
      const item = transactWriteItems({
        body: {},
        key: {
          user_id: operator.user_id,
        },
        operation,
        table: DYNAMO_TABLE_EAGLEUSER_OPERATOR_COMPANIES_ACCESS,
      })

      items.push(item)
    }

    const command = new TransactWriteCommand({
      TransactItems: items,
    })

    logger.debug({ message: items })

    await dynamodbClient.send(command)

    await sleep(200)
  }
}

export default transactWriteOperatorCompaniesAccess
