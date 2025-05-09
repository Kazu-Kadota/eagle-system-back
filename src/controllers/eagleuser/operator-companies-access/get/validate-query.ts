import Joi from 'joi'
import { OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object<OperatorCompaniesAccessKey, true>({
  user_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validateQueryOperatorCompaniesAccessGet = (
  data: Partial<OperatorCompaniesAccessKey>,
): OperatorCompaniesAccessKey => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "get operator companies access" query')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateQueryOperatorCompaniesAccessGet
