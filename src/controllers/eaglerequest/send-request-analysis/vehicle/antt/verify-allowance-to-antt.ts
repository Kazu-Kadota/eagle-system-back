import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flag'
import getFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const verifyAllowanceToANTT = async (company_id: string, dynamoDBClient: DynamoDBClient): Promise<boolean | undefined> => {
  const feature_flag_key: FeatureFlagKey = {
    company_id,
    feature_flag: FeatureFlagsEnum.INFORMATION_ACCESS_VEHICLE_ANTT,
  }

  const feature_flag = await getFeatureFlag(feature_flag_key, dynamoDBClient)

  if (!feature_flag || !feature_flag.enabled) {
    logger.warn({
      message: 'Company not allowed to request this type of analysis',
      feature_flag: FeatureFlagsEnum.INFORMATION_ACCESS_VEHICLE_ANTT,
      company_id,
    })

    // Optei por deixar para poder questionar a empresa que tentou solicitar este tipo de análise
    throw new ErrorHandler('Empresa não autorizada em solicitar este tipo de análise', 403)
  }

  return feature_flag?.enabled
}

export default verifyAllowanceToANTT
