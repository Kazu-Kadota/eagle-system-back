import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export interface ValidateAnswerVehicleQuery {
  vehicle_id: string
}

const schema = Joi.object({
  vehicle_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validateQueryVehicle = (
  data: Partial<ValidateAnswerVehicleQuery | undefined>,
): ValidateAnswerVehicleQuery => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate answer analysis')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateQueryVehicle
