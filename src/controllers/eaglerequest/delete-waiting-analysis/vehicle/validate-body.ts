import Joi from 'joi'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object<VehicleRequestKey, true>({
  vehicle_id: Joi
    .string()
    .uuid()
    .required(),
  request_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validateBodyDeleteWaitingAnalysisVehicle = (
  data: Partial<VehicleRequestKey>,
): VehicleRequestKey => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "delete waiting analysis vehicle" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyDeleteWaitingAnalysisVehicle
