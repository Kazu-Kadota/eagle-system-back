import Joi from 'joi'
import { UserBody, UserGroupEnum } from 'src/models/dynamo/user'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

const schema = Joi.object({
  user_first_name: Joi
    .string()
    .min(3)
    .max(255)
    .required(),
  user_last_name: Joi
    .string()
    .min(3)
    .max(255)
    .required(),
  email: Joi
    .string()
    .email()
    .required(),
  password: Joi
    .string()
    .regex(passwordRegex)
    .required(),
  user_type: Joi
    .string()
    .valid(...Object.values(UserGroupEnum))
    .required(),
  company_name: Joi
    .string()
    .max(255)
    .required(),
  api: Joi
    .boolean()
    .required(),
}).required()

const validateRegister = (
  data: Partial<UserBody>,
): UserBody => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate register request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateRegister
