import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { UserGroupEnum } from 'src/models/dynamo/user'
import getFeatureFlag from 'src/services/aws/dynamo/user/feature-flag/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

export type VerifyAllowanceToSynthesisParams = {
  company_id: string
  user_info: UserInfoFromJwt
  dynamoDBClient: DynamoDBClient
  start_date: string
  final_date: string
}

const verifyAllowanceToSynthesis = async ({
  company_id,
  dynamoDBClient,
  final_date,
  start_date,
  user_info,
}: VerifyAllowanceToSynthesisParams): Promise<void> => {
  if (user_info.user_type === UserGroupEnum.ADMIN) {
    return
  }

  const feature_flag_key: FeatureFlagKey = {
    company_id,
    feature_flag: FeatureFlagsEnum.SYNTHESIS_INFORMATION_ACCESS,
  }

  const feature_flag = await getFeatureFlag<FeatureFlagsEnum.SYNTHESIS_INFORMATION_ACCESS>(feature_flag_key, dynamoDBClient)

  const is_disabled_or_not_exist = !feature_flag
    || (feature_flag && !feature_flag.enabled)

  if (is_disabled_or_not_exist) {
    logger.warn({
      message: 'Company not allowed to generate report',
      ...feature_flag_key,
    })

    throw new ErrorHandler('Empresa não autorizado para gerar relatório', 403)
  }

  const diff_date = (new Date(start_date).getTime() - new Date(final_date).getTime()) / 1000 / 60 / 60 / 24

  if (feature_flag.config.range_date_limit > diff_date) {
    logger.warn({
      message: 'Range data limit exceed for this company',
      start_date,
      final_date,
      diff_date,
      range_date_limit: feature_flag.config.range_date_limit,
    })

    throw new ErrorHandler('Não é possível gerar relatório de síntese entre datas maiores de ' + feature_flag.config.range_date_limit + ' dias', 400)
  }
}

export default verifyAllowanceToSynthesis
