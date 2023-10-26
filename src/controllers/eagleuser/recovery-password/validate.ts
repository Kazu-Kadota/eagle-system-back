import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export interface RecoveryPasswordRequest {
  email: string
}

const schema = Joi.object({
  email: Joi
    .string()
    .email()
    .required(),
}).required()

const validateBody = (
  data: Partial<RecoveryPasswordRequest>,
): RecoveryPasswordRequest => {
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
