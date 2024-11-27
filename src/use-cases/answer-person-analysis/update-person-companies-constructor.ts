import {
  CompaniesAnalysisContent,
  Person,
  PersonRegionType,
} from 'src/models/dynamo/person'
import { is_person_analysis_type_automatic_arr, PersonAnalysisTypeEnum, StateEnum } from 'src/models/dynamo/request-enum'
import ErrorHandler from 'src/utils/error-handler'

export interface UpdatePersonCompaniesConstructorReturn {
  person_companies_analysis_constructor: PersonRegionType<CompaniesAnalysisContent> | CompaniesAnalysisContent | undefined
  person_companies_national_constructor: CompaniesAnalysisContent | undefined
  person_companies_region_constructor: CompaniesAnalysisContent[] | undefined
}

const updatePersonCompaniesConstructor = (
  person: Person,
  person_analysis_type: PersonAnalysisTypeEnum,
  region?: StateEnum,
): UpdatePersonCompaniesConstructorReturn => {
  let person_companies_analysis_constructor: PersonRegionType<CompaniesAnalysisContent> | CompaniesAnalysisContent | undefined
  let person_companies_national_constructor: CompaniesAnalysisContent | undefined
  let person_companies_region_constructor: CompaniesAnalysisContent[] | undefined

  if (person_analysis_type === PersonAnalysisTypeEnum.SIMPLE) {
    person_companies_analysis_constructor = person.companies.simple
    person_companies_national_constructor = person.companies.simple?.national
    person_companies_region_constructor = person.companies.simple?.states
  } else if (person_analysis_type === PersonAnalysisTypeEnum.HISTORY) {
    person_companies_analysis_constructor = person.companies.history
    person_companies_national_constructor = person.companies.history?.national
    person_companies_region_constructor = person.companies.history?.states
  } else if (is_person_analysis_type_automatic_arr.includes(person_analysis_type)) {
    person_companies_analysis_constructor = person.companies[person_analysis_type]
  } else {
    throw new ErrorHandler('Tipo de análise de pessoa não definida', 500)
  }

  return {
    person_companies_analysis_constructor,
    person_companies_national_constructor,
    person_companies_region_constructor: person_companies_region_constructor?.filter(item => item.state !== region),
  }
}

export default updatePersonCompaniesConstructor
