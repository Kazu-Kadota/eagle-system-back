import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

export interface ChangePasswordRequest {
  old_password: string
  password: string
}

const schema = Joi.object({
  old_password: Joi
    .string()
    .regex(passwordRegex)
    .required(),
  password: Joi
    .string()
    .regex(passwordRegex)
    .required(),
}).required()

const validateBody = (
  data: Partial<ChangePasswordRequest>,
): ChangePasswordRequest => {
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
