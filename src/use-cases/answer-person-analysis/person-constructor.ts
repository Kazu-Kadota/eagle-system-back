import { Person } from 'src/models/dynamo/person'
import { PersonAnalysisTypeEnum, PersonRegionTypeEnum, StateEnum } from 'src/models/dynamo/request-enum'
import { PersonRequest } from 'src/models/dynamo/request-person'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

export interface PersonConstructor {
  analysis_info?: string
  company_name: string
  isApproved: boolean
  now: string
  person_analysis_type: PersonAnalysisTypeEnum
  region_type?: PersonRegionTypeEnum
  region?: StateEnum
  request_person: PersonRequest
}

const personConstructor = ({
  analysis_info,
  company_name,
  isApproved,
  now,
  person_analysis_type,
  region_type,
  region,
  request_person,
}: PersonConstructor): Person => {
  let person_constructor: Person

  const is_national_region_type = region_type === PersonRegionTypeEnum.NATIONAL
    || region_type === PersonRegionTypeEnum.NATIONAL_DB

  const is_state_region_type = region_type === PersonRegionTypeEnum.STATES
    || region_type === PersonRegionTypeEnum.NATIONAL_STATE

  if (region_type) {
    if (is_state_region_type) {
      person_constructor = removeEmpty({
        birth_date: request_person.birth_date,
        document: request_person.document,
        mother_name: request_person.mother_name,
        name: request_person.name,
        person_id: request_person.person_id,
        rg: request_person.rg,
        state_rg: request_person.state_rg,
        category_cnh: request_person.category_cnh,
        cnh: request_person.cnh,
        expire_at_cnh: request_person.expire_at_cnh,
        father_name: request_person.father_name,
        naturalness: request_person.naturalness,
        security_number_cnh: request_person.security_number_cnh,
        companies: {
          [person_analysis_type]: {
            [region_type]: [
              {
                state: region,
                name: [company_name],
                updated_at: now,
                request_id: request_person.request_id,
              },
            ],
          },
        },
        validated: {
          [person_analysis_type]: {
            [region_type]: [
              {
                state: region,
                approved: isApproved,
                answer_description: analysis_info || '',
                request_id: request_person.request_id,
                updated_at: now,
              },
            ],
          },
        },
        // black_list: isApproved,
        updated_at: now,
        created_at: now,
      })

      return person_constructor
    } else if (is_national_region_type) {
      person_constructor = removeEmpty({
        birth_date: request_person.birth_date,
        document: request_person.document,
        mother_name: request_person.mother_name,
        name: request_person.name,
        person_id: request_person.person_id,
        rg: request_person.rg,
        state_rg: request_person.state_rg,
        category_cnh: request_person.category_cnh,
        cnh: request_person.cnh,
        expire_at_cnh: request_person.expire_at_cnh,
        father_name: request_person.father_name,
        naturalness: request_person.naturalness,
        security_number_cnh: request_person.security_number_cnh,
        companies: {
          [person_analysis_type]: {
            [region_type]: {
              name: [company_name],
              updated_at: now,
              request_id: request_person.request_id,
            },
          },
        },
        validated: {
          [person_analysis_type]: {
            [region_type]: {
              approved: isApproved,
              answer_description: analysis_info || '',
              request_id: request_person.request_id,
              updated_at: now,
            },
          },
        },
        // black_list: isApproved,
        updated_at: now,
        created_at: now,
      })

      return person_constructor
    } else {
      logger.warn({
        message: 'Region type is not defined to construct person',
        region_type,
      })

      throw new ErrorHandler('Tipo de região não definido para construir pessoa', 500)
    }
  }

  person_constructor = removeEmpty({
    birth_date: request_person.birth_date,
    document: request_person.document,
    mother_name: request_person.mother_name,
    name: request_person.name,
    person_id: request_person.person_id,
    rg: request_person.rg,
    state_rg: request_person.state_rg,
    category_cnh: request_person.category_cnh,
    cnh: request_person.cnh,
    expire_at_cnh: request_person.expire_at_cnh,
    father_name: request_person.father_name,
    naturalness: request_person.naturalness,
    security_number_cnh: request_person.security_number_cnh,
    companies: {
      [person_analysis_type]: {
        name: [company_name],
        updated_at: now,
        request_id: request_person.request_id,
      },
    },
    validated: {
      [person_analysis_type]: {
        approved: isApproved,
        answer_description: analysis_info || '',
        request_id: request_person.request_id,
        updated_at: now,
      },
    },
    // black_list: isApproved,
    updated_at: now,
    created_at: now,
  })

  return person_constructor
}

export default personConstructor
