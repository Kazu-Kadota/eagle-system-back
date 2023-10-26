import Joi from 'joi'
import { PlateStateEnum } from 'src/models/dynamo/request-enum'
import { VehicleRequestPlateHistoryForms } from 'src/models/dynamo/request-vehicle-plate-history'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const plateRegex = /^([A-Za-z0-9]{7})$/
const documentRegex = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/

const schema = Joi.object<VehicleRequestPlateHistoryForms>({
  company_name: Joi
    .string()
    .max(255)
    .optional(),
  owner_document: Joi
    .string()
    .regex(documentRegex)
    .required(),
  owner_name: Joi
    .string()
    .max(255)
    .required(),
  plate: Joi
    .string()
    .regex(plateRegex)
    .required(),
  plate_state: Joi
    .string()
    .valid(...Object.values(PlateStateEnum))
    .required(),
}).required()

const validateBodyVehiclePlateHistory = (
  data: Partial<VehicleRequestPlateHistoryForms>,
): VehicleRequestPlateHistoryForms => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "request vehicle plate history" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyVehiclePlateHistory
