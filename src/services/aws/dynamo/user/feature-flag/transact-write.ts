import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { splitEvery } from 'ramda'
import { FeatureFlagBody, FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { transactWriteItems, TransactWriteOperatorsMap } from 'src/utils/dynamo/transact-write'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'
import sleep from 'src/utils/sleep'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG')

export type TransactWriteFeatureFlagParams<T extends FeatureFlagsEnum> = {
  feature_flags: Array<Partial<FeatureFlagKey & FeatureFlagBody<T>>>
  operation: TransactWriteOperatorsMap,
  dynamodbClient: DynamoDBClient,
}

const transactWriteFeatureFlag = async<T extends FeatureFlagsEnum> ({
  feature_flags,
  operation,
  dynamodbClient,
}: TransactWriteFeatureFlagParams<T>): Promise<void> => {
  logger.debug({
    message: 'TransactWrite to feature flags',
    operation,
  })

  for (const feature_flags_25 of splitEvery(25, feature_flags)) {
    const items = []

    for (const feature_flag_item of feature_flags_25) {
      const { company_id, feature_flag, ...body_items } = feature_flag_item

      const key: FeatureFlagKey = {
        company_id: company_id as string,
        feature_flag: feature_flag as FeatureFlagsEnum,
      }

      const body = {
        ...body_items,
      }

      const item = transactWriteItems({
        body,
        key,
        operation,
        table: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG,
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

export default transactWriteFeatureFlag
