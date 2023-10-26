import Joi from 'joi'
import { AnalysisPathTypeEnum, RequestAnswerPath } from 'src/models/dynamo/answer'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object({
  analysis_type: Joi
    .string()
    .valid(...Object.values(AnalysisPathTypeEnum))
    .optional(),
  id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validatePath = (
  data: Partial<RequestAnswerPath | undefined>,
): RequestAnswerPath => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate answer analysis')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validatePath
