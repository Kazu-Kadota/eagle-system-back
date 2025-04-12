import Joi from 'joi'
import { SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object<SynthesisRequestKey, true>({
  request_id: Joi
    .string()
    .uuid()
    .required(),
  synthesis_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validateSynthesisQuery = (
  data: Partial<SynthesisRequestKey | undefined>,
): SynthesisRequestKey => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "get synthesis" request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateSynthesisQuery
