import Joi from 'joi'
import { SynthesisRequestParams } from 'src/models/dynamo/request-synthesis'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object<SynthesisRequestParams, true>({
  company_name: Joi
    .string()
    .min(3)
    .max(128)
    .optional(),
  person_id: Joi
    .string()
    .uuid()
    .optional(),
  person_request_id: Joi
    .string()
    .uuid()
    .optional(),
  vehicle_id: Joi
    .string()
    .uuid()
    .optional(),
  vehicle_request_id: Joi
    .string()
    .uuid()
    .optional(),
  text: Joi
    .string()
    .base64()
    .required(),
}).required()

const validateBodySynthesis = (
  data: Partial<SynthesisRequestParams>,
): SynthesisRequestParams => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "request synthesis" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodySynthesis
