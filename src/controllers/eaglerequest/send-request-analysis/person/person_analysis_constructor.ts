import { is_person_analysis_type_automatic, PersonAnalysisTypeEnum, PersonRegionTypeEnum } from 'src/models/dynamo/request-enum'
import { PersonAnalysisItems } from 'src/models/dynamo/request-person'

import useCasePublishSnsTopicPerson from 'src/use-cases/publish-techimze-sns-topic-person'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import personAnalysis, { PersonAnalysisRequest, PersonAnalysisResponse } from './person'

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

  const is_type_simple_or_history = PersonAnalysisTypeEnum.SIMPLE || PersonAnalysisTypeEnum.HISTORY

  if (person_analysis_type === is_type_simple_or_history) {
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
      } else if (region_type === PersonRegionTypeEnum.NATIONAL || PersonRegionTypeEnum.NATIONAL_DB) {
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
  } else if (person_analysis_type === is_person_analysis_type_automatic) {
    const person_analysis_constructor: PersonAnalysisRequest = {
      ...person_analysis_request,
      person_analysis_type,
    }

    person_analyzes.push(await personAnalysis(person_analysis_constructor))

    await useCasePublishSnsTopicPerson({
      cpf: person_analysis_request.person_data.document,
      person_analysis_type,
      person_id: person_analyzes[0].person_id,
      request_id: person_analyzes[0].request_id,
      snsClient: person_analysis_constructor.snsClient,
    })
  } else {
    logger.warn({
      message: 'There is no person analysis type that match condition',
      person_analysis_type,
    })

    throw new ErrorHandler('Não existe o tipo de anáise de pessoa especificada', 500)
  }

  return person_analyzes
}

export default personAnalysisConstructor
