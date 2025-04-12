import Joi from 'joi'
import {
  DriverCategoryEnum,
  PersonAnalysisTypeEnum,
  PersonIntegrationPostbackEnum,
  PersonRegionTypeEnum,
  PlateStateEnum,
  StateEnum,
  VehicleIntegrationPostbackEnum,
  VehicleType,
} from 'src/models/dynamo/request-enum'
import { PersonAnalysisItems, PersonRequestAnalysis, PersonRequestForms } from 'src/models/dynamo/request-person'
import { VehicleRequestForms } from 'src/models/dynamo/request-vehicle'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export interface ValidateRequestCombo extends PersonRequestAnalysis {
  combo_number: number
  vehicles: VehicleRequestForms[]
}

const documentRegex = /^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2})$/
const cnhRegex = /(?=.*\d)[A-Za-z0-9]{1,11}/
const plateRegex = /^([A-Za-z0-9]{7})$/

const valid_person_analysis_type = [PersonAnalysisTypeEnum.HISTORY, PersonAnalysisTypeEnum.SIMPLE]
const valid_person_analysis_region_type = [PersonRegionTypeEnum.STATES, PersonRegionTypeEnum.NATIONAL]

const schema = Joi.object<ValidateRequestCombo, true>({
  combo_number: Joi
    .number()
    .required(),
  person_analysis: Joi.array<PersonAnalysisItems[]>().items(
    Joi.object({
      type: Joi
        .string()
        .valid(...valid_person_analysis_type)
        .required(),
      region_types: Joi
        .array()
        .items(
          Joi.string().valid(...valid_person_analysis_region_type),
        )
        .max(2)
        .required(),
      regions: Joi
        .array()
        .items(Joi
          .string()
          .valid(...Object.values(StateEnum)))
        .max(27)
        .when('region_types', {
          is: Joi.array().items().has(PersonRegionTypeEnum.STATES),
          then: Joi.required(),
          otherwise: Joi.forbidden(),
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
    metadata: Joi
      .object()
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
    postback: Joi
      .string()
      .max(255)
      .valid(...Object.values(PersonIntegrationPostbackEnum))
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
  vehicles: Joi.array<VehicleRequestForms[]>().items(
    Joi.object<VehicleRequestForms, true>({
      chassis: Joi
        .string()
        .max(255)
        .optional(),
      company_name: Joi
        .string()
        .max(255)
        .optional(),
      driver_name: Joi
        .string()
        .max(255)
        .optional(),
      metadata: Joi
        .object()
        .optional(),
      owner_document: Joi
        .string()
        .regex(documentRegex)
        .required(),
      owner_name: Joi
        .string()
        .max(255)
        .required(),
      plate_state: Joi
        .string()
        .valid(...Object.values(PlateStateEnum))
        .required(),
      plate: Joi
        .string()
        .regex(plateRegex)
        .required(),
      postback: Joi
        .string()
        .max(255)
        .valid(...Object.values(VehicleIntegrationPostbackEnum))
        .optional(),
      renavam: Joi
        .string()
        .max(255)
        .optional(),
      vehicle_model: Joi
        .string()
        .max(255)
        .optional(),
      vehicle_type: Joi
        .string()
        .valid(...Object.values(VehicleType))
        .required(),
    }).required(),
  ).required(),
}).required()

const validateBodyCombo = (
  data: Partial<ValidateRequestCombo>,
): ValidateRequestCombo => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "request combo" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyCombo
