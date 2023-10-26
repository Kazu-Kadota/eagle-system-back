import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { PersonAnalysisItems } from 'src/models/dynamo/request-person'

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

  if (person_analysis.type !== PersonAnalysisTypeEnum.CNH_STATUS) {
    for (const region_type of person_analysis.region_types) {
      const person_analysis_constructor: PersonAnalysisRequest = {
        ...person_analysis_request,
        person_analysis_type,
        region_type,
      }

      if (region_type === 'states') {
        for (const region of person_analysis.regions) {
          person_analysis_constructor.region = region

          person_analyzes.push(await personAnalysis(person_analysis_constructor))
        }
      } else {
        person_analyzes.push(await personAnalysis(person_analysis_constructor))
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
