import Joi from 'joi'
import { SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object<SynthesisRequestKey, true>({
  synthesis_id: Joi
    .string()
    .uuid()
    .required(),
  request_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validateBodyDeleteAnalysisSynthesis = (
  data: Partial<SynthesisRequestKey>,
): SynthesisRequestKey => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "delete analysis synthesis" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyDeleteAnalysisSynthesis
