import { AttributeValue, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flag'
import { is_person_analysis_type_automatic, PersonAnalysisTypeEnum, personAnalysisTypeFeatureFlagMap, PersonRegionTypeEnum } from 'src/models/dynamo/request-enum'
import { PersonAnalysisItems } from 'src/models/dynamo/request-person'
import queryByCompanyId, { QueryByCompanyId } from 'src/services/aws/dynamo/user/feature-flag/query-by-company-id'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type VerifyAllowanceWithFeatureFlagParams = {
  company_id: string
  dynamodbClient: DynamoDBClient
  person_analysis: PersonAnalysisItems[]
}

const verifyAllowanceWithFeatureFlag = async ({
  company_id,
  dynamodbClient: dynamodbClient,
  person_analysis
}: VerifyAllowanceWithFeatureFlagParams): Promise<void> => {
  let last_evaluated_key: Record<string, AttributeValue> | undefined = undefined
  const company_feature_flags: FeatureFlagsEnum[] = []

  const query_by_company_id_params: QueryByCompanyId = {
    company_id,
  }

  do {
    const list_feature_flag = await queryByCompanyId(query_by_company_id_params, dynamodbClient, last_evaluated_key)

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

  const invalid_person_analysis_set: Set<PersonAnalysisTypeEnum> = new Set()

  for (const person_analysis_item of person_analysis) {
    const type = person_analysis_item.type
    if (type !== is_person_analysis_type_automatic) {
      // Essa parte do código irá sumir com a refatoração do "National + DB"
      for (const region_type of person_analysis_item.region_types) {
        if (region_type === PersonRegionTypeEnum.NATIONAL_DB) {
          const feature_flag_find = company_feature_flags.find((feature_flag) => feature_flag === FeatureFlagsEnum.DATABASE_ACCESS_CONSULT)

          if (!feature_flag_find) {
            invalid_person_analysis_set.add(person_analysis_item.type)
          }
        }
      }
      // Até aqui. É somente um "continue" dentro do if
    }

    const mapped_person_analysis = personAnalysisTypeFeatureFlagMap[type]
    const feature_flag_find = company_feature_flags.find((feature_flag) => feature_flag === mapped_person_analysis)

    if (!feature_flag_find) {
      invalid_person_analysis_set.add(person_analysis_item.type)
    }
  }

  if (invalid_person_analysis_set.size !== 0) {
    const invalid_person_analysis = Array.from(invalid_person_analysis_set)
    logger.warn({
      message: 'Company not allowed to request analysis to the selected options',
      invalid_person_analysis,
    })

    throw new ErrorHandler('Empresa não autorizado para solicitar análise para as seguintes opções', 400, [invalid_person_analysis])
  }
}

export default verifyAllowanceWithFeatureFlag
