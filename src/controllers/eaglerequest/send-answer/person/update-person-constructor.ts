import { Person } from 'src/models/dynamo/person'
import { PersonAnalysisTypeEnum, PersonRegionTypeEnum, StateEnum } from 'src/models/dynamo/request-enum'
import { PersonRequest } from 'src/models/dynamo/request-person'
import removeEmpty from 'src/utils/remove-empty'

import updatePersonCompaniesConstructor from './update-person-companies-constructor'
import updatePersonValidatedConstructor from './update-person-validated-constructor'
import verifyCompaniesArray from './verify-companies-array'

export interface UpdatePersonConstructor {
  analysis_info?: string
  company_name: string
  isApproved: boolean
  now: string
  person_analysis_type: PersonAnalysisTypeEnum
  person: Person
  region_type?: PersonRegionTypeEnum
  region?: StateEnum
  request_person: PersonRequest,
}

const updatePersonConstructor = ({
  analysis_info,
  company_name,
  isApproved,
  now,
  person_analysis_type,
  person,
  region_type,
  region,
  request_person,
}: UpdatePersonConstructor): Person => {
  const companies_array = verifyCompaniesArray(
    person,
    person_analysis_type,
    company_name,
    region,
  )

  const {
    person_companies_analysis_constructor,
    person_companies_region_constructor,
  } = updatePersonCompaniesConstructor(person, person_analysis_type, region)

  const {
    person_validated_analysis_constructor,
    person_validated_region_constructor,
  } = updatePersonValidatedConstructor(person, person_analysis_type, region)

  let person_constructor: Person

  if (region_type) {
    if (region) {
      person_constructor = removeEmpty({
        ...person,
        companies: {
          ...person.companies,
          [person_analysis_type]: {
            ...person_companies_analysis_constructor || '',
            [region_type]: [
              ...person_companies_region_constructor || '',
              {
                state: region,
                name: companies_array,
                updated_at: now,
                request_id: request_person.request_id,
              },
            ],
          },
        },
        validated: {
          ...person.validated,
          [person_analysis_type]: {
            ...person_validated_analysis_constructor || '',
            [region_type]: [
              ...person_validated_region_constructor || '',
              {
                state: region,
                approved: isApproved,
                updated_at: now,
                request_id: request_person.request_id,
                answer_description: analysis_info || '',
              },
            ],
          },
          // black_list: isApproved,
        },
      })
    } else {
      person_constructor = removeEmpty({
        ...person,
        companies: {
          ...person.companies,
          [person_analysis_type]: {
            ...person_companies_analysis_constructor || '',
            [region_type]: {
              name: companies_array,
              updated_at: now,
              request_id: request_person.request_id,
            },
          },
        },
        validated: {
          ...person.validated,
          [person_analysis_type]: {
            ...person_validated_analysis_constructor || '',
            [region_type]: {
              approved: isApproved,
              updated_at: now,
              request_id: request_person.request_id,
              answer_description: analysis_info || '',
            },
          },
          // black_list: isApproved,
        },
      })
    }

    return person_constructor
  } else {
    person_constructor = removeEmpty({
      ...person,
      companies: {
        ...person.companies,
        [person_analysis_type]: {
          ...person_companies_analysis_constructor || '',
          name: companies_array,
          updated_at: now,
          request_id: request_person.request_id,
        },
      },
      validated: {
        ...person.validated,
        [person_analysis_type]: {
          ...person_validated_analysis_constructor || '',
          approved: isApproved,
          answer_description: analysis_info,
          request_id: request_person.request_id,
          updated_at: now,
        },
        // black_list: isApproved,
      },
    })

    return person_constructor
  }
}

export default updatePersonConstructor
