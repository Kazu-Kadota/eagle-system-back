import Joi from 'joi'
import { PlateStateEnum } from 'src/models/dynamo/request-enum'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const plateRegex = /^([A-Za-z0-9]{7})$/

export interface RequestVehicleByPlateQuery {
  plate: string
  plate_state: PlateStateEnum
  company_name?: string
}

const schema = Joi.object({
  plate: Joi
    .string()
    .regex(plateRegex)
    .required(),
  plate_state: Joi
    .string()
    .valid(...Object.values(PlateStateEnum))
    .required(),
  company_name: Joi
    .string()
    .optional(),
}).required()

const validateQueryVehicle = (
  data: Partial<RequestVehicleByPlateQuery | undefined>,
): RequestVehicleByPlateQuery => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate query string of query vehicle by document email request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateQueryVehicle
