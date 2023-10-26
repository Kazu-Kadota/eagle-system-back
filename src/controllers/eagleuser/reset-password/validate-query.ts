import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export interface ResetPasswordQueryRequest {
  email: string
  recovery_id: string
}

const schema = Joi.object({
  email: Joi
    .string()
    .email()
    .required(),
  recovery_id: Joi
    .string()
    .required(),
}).required()

const validateQuery = (
  data: Partial<ResetPasswordQueryRequest>,
): ResetPasswordQueryRequest => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate login request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateQuery
