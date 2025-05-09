import Joi from 'joi'
import { AnalysisResultEnum, RequestAnswerBody } from 'src/models/dynamo/answer'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type ChangeAnalysisAnswerVehicleParams = VehicleRequestKey & RequestAnswerBody

const schema = Joi.object<ChangeAnalysisAnswerVehicleParams, true>({
  vehicle_id: Joi
    .string()
    .uuid()
    .required(),
  request_id: Joi
    .string()
    .uuid()
    .required(),
  analysis_result: Joi
    .string()
    .valid(...Object.values(AnalysisResultEnum))
    .required(),
  analysis_info: Joi
    .string()
    .when('analysis_result', {
      is: 'REJECTED',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  from_db: Joi
    .boolean()
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
