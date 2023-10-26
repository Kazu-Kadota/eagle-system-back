import { Person } from 'src/models/dynamo/person'
import { PersonAnalysisTypeEnum, StateEnum } from 'src/models/dynamo/request-enum'
import ErrorHandler from 'src/utils/error-handler'

const verifyCompaniesArray = (
  person: Person,
  person_analysis_type: PersonAnalysisTypeEnum,
  company_name: string,
  region?: StateEnum,
) => {
  let companies_array: string[] | undefined

  if (region) {
    if (person_analysis_type === PersonAnalysisTypeEnum.SIMPLE) {
      companies_array = person.companies.simple?.states?.find(item => item.state === region)?.name || []
    } else if (person_analysis_type === PersonAnalysisTypeEnum.HISTORY) {
      companies_array = person.companies.history?.states?.find(item => item.state === region)?.name || []
    } else if (person_analysis_type === PersonAnalysisTypeEnum.CNH_STATUS) {
      companies_array = person.companies['cnh-status']?.name || []
    } else {
      throw new ErrorHandler('Tipo de análise de pessoa não definida', 500)
    }
  } else {
    if (person_analysis_type === PersonAnalysisTypeEnum.SIMPLE) {
      companies_array = person.companies.simple?.national?.name || []
    } else if (person_analysis_type === PersonAnalysisTypeEnum.HISTORY) {
      companies_array = person.companies.history?.national?.name || []
    } else if (person_analysis_type === PersonAnalysisTypeEnum.CNH_STATUS) {
      companies_array = person.companies['cnh-status']?.name || []
    } else {
      throw new ErrorHandler('Tipo de análise de pessoa não definida', 500)
    }
  }

  if (!companies_array?.includes(company_name)) {
    companies_array?.push(company_name)
  }

  return companies_array
}

export default verifyCompaniesArray
