import Joi from 'joi'

import { UserGroupEnum } from 'src/models/dynamo/user'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { ListUsersParam } from './main'

const schema = Joi.object<ListUsersParam, true>({
  user_type_filter: Joi.array<Array<UserGroupEnum>>().items(
    Joi
      .string()
      .valid(...Object.values(UserGroupEnum))
      .required(),
  ).optional(),
}).required()

const validateBodyListUsers = (
  data: Partial<ListUsersParam>,
): ListUsersParam => {
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
