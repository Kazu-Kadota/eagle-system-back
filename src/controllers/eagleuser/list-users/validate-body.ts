import Joi from 'joi'

import { UserGroupEnum } from 'src/models/dynamo/user'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.array<Array<UserGroupEnum>>().items(
  Joi
    .string()
    .valid(...Object.values(UserGroupEnum))
    .required(),
).optional()

const validateBodyListUsers = (
  data: Partial<Array<UserGroupEnum>>,
): Array<UserGroupEnum> => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "list users" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyListUsers
