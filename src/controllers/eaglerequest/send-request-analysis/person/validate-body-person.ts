import Joi from 'joi'
import {
  DriverCategoryEnum,
  is_person_analysis_type_automatic_arr,
  PersonAnalysisTypeEnum,
  PersonRegionTypeEnum,
  StateEnum,
} from 'src/models/dynamo/request-enum'
import { PersonAnalysisItems, PersonRequestAnalysis, PersonRequestForms } from 'src/models/dynamo/request-person'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const documentRegex = /^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2})$/
const cnhRegex = /(?=.*\d)[A-Za-z0-9]{1,11}/

const is_person_analysis_type_automatic_arr_joi = Joi.valid(...is_person_analysis_type_automatic_arr)

const schema = Joi.object<PersonRequestAnalysis, true>({
  person_analysis: Joi.array<PersonAnalysisItems[]>().items(
    Joi.object<PersonAnalysisItems, true>({
      type: Joi
        .string()
        .valid(...Object.values(PersonAnalysisTypeEnum))
        .required(),
      region_types: Joi
        .array()
        .items(
          Joi.string().valid(...Object.values(PersonRegionTypeEnum)),
        )
        .max(2)
        .min(1)
        .when('type', {
          is: is_person_analysis_type_automatic_arr_joi,
          then: Joi.forbidden(),
          otherwise: Joi.required(),
        }),
      regions: Joi
        .array()
        .items(
          Joi.string().valid(...Object.values(StateEnum)),
        )
        .min(1)
        .when('type', {
          is: is_person_analysis_type_automatic_arr_joi,
          then: Joi.forbidden(),
          otherwise: Joi.when('region_types', {
            is: Joi.array().items().has(PersonRegionTypeEnum.NATIONAL_STATE),
            then: Joi.array().max(1).required(),
            otherwise: Joi.when('region_types', {
              is: Joi.array().items().has(PersonRegionTypeEnum.STATES),
              then: Joi.array().max(27).required(),
              otherwise: Joi.forbidden(),
            }),
          }),
        }),
    }).required(),
  ).required(),
  person: Joi.object<PersonRequestForms, true>({
    birth_date: Joi
      .string()
      .isoDate()
      .required(),
    category_cnh: Joi
      .string()
      .valid(...Object.values(DriverCategoryEnum))
      .optional(),
    cnh: Joi
      .string()
      .regex(cnhRegex)
      .optional(),
    company_name: Joi
      .string()
      .max(255)
      .optional(),
    document: Joi
      .string()
      .regex(documentRegex)
      .required(),
    expire_at_cnh: Joi
      .string()
      .isoDate()
      .optional(),
    father_name: Joi
      .string()
      .max(255)
      .optional(),
    mother_name: Joi
      .string()
      .max(255)
      .required(),
    name: Joi
      .string()
      .max(255)
      .required(),
    naturalness: Joi
      .string()
      .optional(),
    rg: Joi
      .string()
      .required(),
    security_number_cnh: Joi
      .string()
      .optional(),
    state_rg: Joi
      .string()
      .valid(...Object.values(StateEnum))
      .required(),
  }).required(),
}).required()

const validateBodyPerson = (
  data: Partial<PersonRequestAnalysis>,
): PersonRequestAnalysis => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "request person" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyPerson
