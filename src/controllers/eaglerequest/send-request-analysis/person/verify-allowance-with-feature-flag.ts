import { AttributeValue, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import { is_person_analysis_type_automatic_arr, PersonAnalysisTypeEnum, PersonRegionTypeEnum, person_analysis_type_feature_flag_map, person_region_type_feature_flag_map } from 'src/models/dynamo/request-enum'
import { PersonAnalysisItems } from 'src/models/dynamo/request-person'
import queryFeatureFlag, { QueryByCompanyId } from 'src/services/aws/dynamo/user/feature-flag/query'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type VerifyAllowanceWithFeatureFlagParams = {
  company_id: string
  dynamodbClient: DynamoDBClient
  person_analysis: PersonAnalysisItems[]
}

const verifyAllowanceWithFeatureFlag = async ({
  company_id,
  dynamodbClient,
  person_analysis,
}: VerifyAllowanceWithFeatureFlagParams): Promise<void> => {
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

  const invalid_person_analysis_set: Set<PersonAnalysisTypeEnum | PersonRegionTypeEnum.NATIONAL_DB | PersonRegionTypeEnum.NATIONAL_STATE> = new Set()

  for (const person_analysis_item of person_analysis) {
    const type = person_analysis_item.type
    if (!is_person_analysis_type_automatic_arr.includes(type)) {
      for (const region_type of person_analysis_item.region_types) {
        const feature_flag_region_type = region_type === PersonRegionTypeEnum.NATIONAL_DB
          || region_type === PersonRegionTypeEnum.NATIONAL_STATE
        if (feature_flag_region_type) {
          const feature_flag_find = company_feature_flags.find((feature_flag) =>
            feature_flag === person_region_type_feature_flag_map[region_type],
          )

          if (!feature_flag_find) {
            invalid_person_analysis_set.add(region_type)
          }
        }
      }
    } else {
      const mapped_person_analysis = person_analysis_type_feature_flag_map[type]
      const feature_flag_find = company_feature_flags.find((feature_flag) => feature_flag === mapped_person_analysis)

      if (!feature_flag_find) {
        invalid_person_analysis_set.add(person_analysis_item.type)
      }
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
