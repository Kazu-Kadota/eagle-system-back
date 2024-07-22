import { PersonAnalysisTypeEnum, PersonRegionTypeEnum } from 'src/models/dynamo/request-enum'
import { PersonAnalysisItems } from 'src/models/dynamo/request-person'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import getCompanyByNameAdapter from './get-company-adapter'
import personAnalysis, { PersonAnalysisRequest, PersonAnalysisResponse } from './person'
import verifyAllowanceToNationalDB from './verify-allowance-to-national-db'

export interface PersonAnalysisConstructor extends Omit<
  PersonAnalysisRequest,
  'region_type'
  | 'person_analysis_type'
  | 'region'
> {}

const personAnalysisConstructor = async (
  person_analysis: PersonAnalysisItems,
  person_analysis_request: PersonAnalysisConstructor,
): Promise<PersonAnalysisResponse[]> => {
  const person_analysis_type = person_analysis.type

  const person_analyzes: PersonAnalysisResponse[] = []

  if (person_analysis_request.user_info.user_type === 'admin' && !person_analysis_request.person_data.company_name) {
    logger.warn({
      message: 'Need to inform company name for admin user',
      user_type: person_analysis_request.user_info.user_type,
    })

    throw new ErrorHandler('É necessário informar o nome da empresa para usuários admin', 400)
  }

  if (person_analysis.type !== PersonAnalysisTypeEnum.CNH_STATUS) {
    for (const region_type of person_analysis.region_types) {
      const person_analysis_constructor: PersonAnalysisRequest = {
        ...person_analysis_request,
        person_analysis_type,
        region_type,
      }

      if (region_type === PersonRegionTypeEnum.STATES) {
        for (const region of person_analysis.regions) {
          person_analysis_constructor.region = region

          person_analyzes.push(await personAnalysis(person_analysis_constructor))
        }
      } else if (region_type === PersonRegionTypeEnum.NATIONAL_DB) {
        let company_name = person_analysis_request.user_info.company_name

        if (person_analysis_request.user_info.user_type === 'admin') {
          company_name = person_analysis_request.person_data.company_name as string
        }

        const company = await getCompanyByNameAdapter(company_name, person_analysis_request.dynamodbClient)

        const is_allowed = await verifyAllowanceToNationalDB(company.company_id, person_analysis_request.dynamodbClient)

        if (is_allowed) {
          person_analyzes.push(await personAnalysis(person_analysis_constructor))
        } else {
          logger.warn({
            message: 'Company not allowed to request this type of analysis',
            region_type,
            company_id: company.company_id,
            company_name: company.name,
          })

          // Optei por deixar para poder questionar a empresa que tentou solicitar este tipo de análise
          throw new ErrorHandler('Empresa não autorizada em solicitar este tipo de análise', 403)
        }
      } else if (region_type === PersonRegionTypeEnum.NATIONAL) {
        person_analyzes.push(await personAnalysis(person_analysis_constructor))
      } else {
        logger.warn({
          message: 'There is no region type to match',
          region_type,
        })

        throw new ErrorHandler('Não existe o tipo de região especificada', 500)
      }
    }

    return person_analyzes
  }

  const person_analysis_constructor: PersonAnalysisRequest = {
    ...person_analysis_request,
    person_analysis_type,
  }

  person_analyzes.push(await personAnalysis(person_analysis_constructor))

  return person_analyzes
}

export default personAnalysisConstructor
