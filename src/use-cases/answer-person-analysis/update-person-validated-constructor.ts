import {
  Person,
  PersonRegionType,
  PersonValidatedContent,
} from 'src/models/dynamo/person'
import { is_person_analysis_type_automatic, PersonAnalysisTypeEnum, StateEnum } from 'src/models/dynamo/request-enum'
import ErrorHandler from 'src/utils/error-handler'

export interface UpdatePersonCompaniesConstructorReturn {
  person_validated_analysis_constructor: PersonRegionType<PersonValidatedContent> | PersonValidatedContent | undefined
  person_validated_national_constructor: PersonValidatedContent | undefined
  person_validated_region_constructor: PersonValidatedContent[] |undefined
}

const updatePersonValidatedConstructor = (
  person: Person,
  person_analysis_type: PersonAnalysisTypeEnum,
  region?: StateEnum,
): UpdatePersonCompaniesConstructorReturn => {
  let person_validated_analysis_constructor: PersonRegionType<PersonValidatedContent> | PersonValidatedContent | undefined
  let person_validated_national_constructor: PersonValidatedContent | undefined
  let person_validated_region_constructor: PersonValidatedContent[] |undefined

  if (person_analysis_type === PersonAnalysisTypeEnum.SIMPLE) {
    person_validated_analysis_constructor = person.validated.simple
    person_validated_national_constructor = person.validated.simple?.national
    person_validated_region_constructor = person.validated.simple?.states
  } else if (person_analysis_type === PersonAnalysisTypeEnum.HISTORY) {
    person_validated_analysis_constructor = person.validated.history
    person_validated_national_constructor = person.validated.history?.national
    person_validated_region_constructor = person.validated.history?.states
  } else if (person_analysis_type === is_person_analysis_type_automatic) {
    person_validated_analysis_constructor = person.validated[person_analysis_type]
  } else {
    throw new ErrorHandler('Tipo de análise de pessoa não definida', 500)
  }

  return {
    person_validated_analysis_constructor,
    person_validated_national_constructor,
    person_validated_region_constructor: person_validated_region_constructor?.filter(item => item.state !== region),
  }
}

export default updatePersonValidatedConstructor
