import Joi from 'joi'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type ChangeAnalysisAnswerVehicleParams = VehicleRequestKey & {
  analysis_info: string
}

const schema = Joi.object<ChangeAnalysisAnswerVehicleParams, true>({
  vehicle_id: Joi
    .string()
    .uuid()
    .optional(),
  request_id: Joi
    .string()
    .uuid()
    .optional(),
  analysis_info: Joi
    .string()
    .required(),
}).required()

const validateBodyChangeAnalysisAnswerVehicle = (
  data: Partial<ChangeAnalysisAnswerVehicleParams>,
): ChangeAnalysisAnswerVehicleParams => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "change analysis answer vehicle" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyChangeAnalysisAnswerVehicle
