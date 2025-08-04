import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import queryFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/query'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type VerifyAllowanceToSynthesisWithFeatureFlagParams = {
  company_id: string
  dynamodbClient: DynamoDBClient
}

const verifyAllowanceToSynthesisWithFeatureFlag = async ({
  company_id,
  dynamodbClient,
}: VerifyAllowanceToSynthesisWithFeatureFlagParams): Promise<void> => {
  const query_by_company_id_params: FeatureFlagKey = {
    company_id,
    feature_flag: FeatureFlagsEnum.SYNTHESIS_INFORMATION_ACCESS,
  }

  const feature_flag = await queryFeatureFlag(query_by_company_id_params, dynamodbClient)

  if (!feature_flag) {
    logger.warn({
      message: 'Company not allowed to request synthesis analysis',
      query_by_company_id_params,
    })

    throw new ErrorHandler('Empresa não autorizado para solicitar análise de sintese', 400)
  }
}

export default verifyAllowanceToSynthesisWithFeatureFlag
