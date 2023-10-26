import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export interface RequestVehicleByRequestId {
  vehicle_id: string
}

const schema = Joi.object({
  vehicle_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validateVehicleParam = (
  data: Partial<RequestVehicleByRequestId | undefined>,
): RequestVehicleByRequestId => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "request vehicle" request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateVehicleParam
