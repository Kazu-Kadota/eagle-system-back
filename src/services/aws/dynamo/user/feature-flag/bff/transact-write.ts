import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { splitEvery } from 'ramda'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { FeatureFlagBFFBody, FeatureFlagBFFKey } from 'src/models/dynamo/feature-flags/feature-flag-bff'
import { transactWriteItems, TransactWriteOperatorsMap } from 'src/utils/dynamo/transact-write'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import sleep from 'src/utils/sleep'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF')

export type TransactWriteFeatureFlagBFFParams<T extends FeatureFlagsEnum> = {
  feature_flags_bff: Array<Partial<FeatureFlagBFFKey & FeatureFlagBFFBody<T>>>
  operation: TransactWriteOperatorsMap,
  dynamodbClient: DynamoDBClient,
}

const transactWriteFeatureFlagBFF = async<T extends FeatureFlagsEnum> ({
  feature_flags_bff,
  operation,
  dynamodbClient,
}: TransactWriteFeatureFlagBFFParams<T>): Promise<void> => {
  logger.debug({
    message: 'TransactWrite to feature flags BFF',
    operation,
  })

  for (const feature_flags_bff_25 of splitEvery(25, feature_flags_bff)) {
    const items = []

    for (const feature_flag_bff_item of feature_flags_bff_25) {
      const { feature_flag, ...body_items } = feature_flag_bff_item

      const key: FeatureFlagBFFKey = {
        feature_flag: feature_flag as FeatureFlagsEnum,
      }

      const body = {
        ...body_items,
      }

      const item = transactWriteItems({
        body,
        key,
        operation,
        table: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF,
      })

      items.push(item)
    }

    const command = new TransactWriteCommand({
      TransactItems: items,
    })

    await dynamodbClient.send(command)

    await sleep(200)
  }
}

export default transactWriteFeatureFlagBFF
