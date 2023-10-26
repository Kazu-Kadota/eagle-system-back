import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export interface ValidatePersonQuery {
  request_id: string
}

const schema = Joi.object({
  request_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validatePersonQuery = (
  data: Partial<ValidatePersonQuery | undefined>,
): ValidatePersonQuery => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "request person" request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validatePersonQuery
