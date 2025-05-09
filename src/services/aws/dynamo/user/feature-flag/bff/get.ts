import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { FeatureFlagBFF, FeatureFlagBFFKey } from 'src/models/dynamo/feature-flags/feature-flag-bff'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF')

const getFeatureFlagBFF = async <T extends FeatureFlagsEnum> (
  key: FeatureFlagBFFKey,
  dynamodbClient: DynamoDBClient,
): Promise<FeatureFlagBFF<T> | undefined> => {
  logger.debug({
    message: 'Getting feature flag BFF',
    feature_flag: key.feature_flag,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG_BFF,
    Key: marshall(key),
  })

  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as FeatureFlagBFF<T>
}

export default getFeatureFlagBFF
