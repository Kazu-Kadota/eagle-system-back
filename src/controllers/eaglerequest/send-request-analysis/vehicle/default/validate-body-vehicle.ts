import Joi from 'joi'
import { PlateStateEnum, VehicleIntegrationPostbackEnum, VehicleType } from 'src/models/dynamo/request-enum'
import { VehicleRequestForms } from 'src/models/dynamo/request-vehicle'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const plateRegex = /^([A-Za-z0-9]{7})$/
const documentRegex = /^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2})$/

const schema = Joi.object<VehicleRequestForms, true>({
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
}).required()

const validateBodyVehicle = (
  data: Partial<VehicleRequestForms>,
): VehicleRequestForms => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "request vehicle default" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyVehicle
