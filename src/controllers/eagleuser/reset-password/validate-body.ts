import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

export interface ResetPasswordBodyRequest {
  password: string
  confirm_password: string
}

const schema = Joi.object({
  password: Joi
    .string()
    .regex(passwordRegex)
    .required(),
  confirm_password: Joi
    .string()
    .regex(passwordRegex)
    .required(),
}).required()

const validateBody = (
  data: Partial<ResetPasswordBodyRequest>,
): ResetPasswordBodyRequest => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate login request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBody
