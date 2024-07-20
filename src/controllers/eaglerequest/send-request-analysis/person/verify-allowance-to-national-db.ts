import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { FeatureFlagKey, FeatureFlagsEnum } from "src/models/dynamo/feature-flag"
import getFeatureFlag from "src/services/aws/dynamo/user/feature-flag/get"

const verifyAllowanceToNationalDB = async (company_id: string, dynamoDBClient: DynamoDBClient): Promise<boolean | undefined> => {
  const feature_flag_key: FeatureFlagKey = {
    company_id,
    feature_flag: FeatureFlagsEnum.DATABASE_ACCESS_CONSULT,
  }

  const feature_flag = await getFeatureFlag(feature_flag_key, dynamoDBClient)

  return feature_flag?.enabled
}

export default verifyAllowanceToNationalDB
