import { AttributeValue, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import queryFeatureFlag, { QueryByCompanyId } from 'src/services/aws/dynamo/user/feature-flag/query'
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
  let last_evaluated_key: Record<string, AttributeValue> | undefined
  const company_feature_flags: FeatureFlagsEnum[] = []

  const query_by_company_id_params: QueryByCompanyId = {
    company_id,
  }

  do {
    const list_feature_flag = await queryFeatureFlag(query_by_company_id_params, dynamodbClient, last_evaluated_key)

    if (!list_feature_flag) {
      break
    }

    for (const item of list_feature_flag.feature_flag) {
      if (item.enabled) {
        company_feature_flags.push(item.feature_flag)
      }
    }

    last_evaluated_key = list_feature_flag?.last_evaluated_key
  }
  while (last_evaluated_key)

  if (!company_feature_flags.includes(FeatureFlagsEnum.SYNTHESIS_INFORMATION_ACCESS)) {
    logger.warn({
      message: 'Company not allowed to request synthesis analysis',
      company_feature_flags,
    })

    throw new ErrorHandler('Empresa não autorizado para solicitar análise para as seguintes opções', 400, company_feature_flags)
  }
}

export default verifyAllowanceToSynthesisWithFeatureFlag
