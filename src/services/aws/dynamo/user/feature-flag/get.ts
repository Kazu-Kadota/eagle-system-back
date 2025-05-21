import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import {
  FeatureFlag,
  FeatureFlagKey,
  FeatureFlagsEnum,
} from 'src/models/dynamo/feature-flags/feature-flag'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG = getStringEnv('DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG')

const getFeatureFlag = async <T extends FeatureFlagsEnum> (
  key: FeatureFlagKey,
  dynamodbClient: DynamoDBClient,
): Promise<FeatureFlag<T> | undefined> => {
  logger.debug({
    message: 'Getting feature flag by company id and feature_flag',
    company_id: key.company_id,
    feature_flag: key.feature_flag,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEUSER_FEATURE_FLAG,
    Key: marshall(key),
  })

  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as FeatureFlag<T>
}

export default getFeatureFlag
