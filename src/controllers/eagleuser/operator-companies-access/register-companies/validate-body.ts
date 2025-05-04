import Joi from 'joi'
import { OperatorCompaniesAccessRegisterParams } from 'src/models/dynamo/users/operator-companies-access'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object<OperatorCompaniesAccessRegisterParams, true>({
  companies: Joi.array<Array<string>>().items(
    Joi.string().max(255).required(),
  ).required(),
  user_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validateBodyOperatorCompaniesAccessRegister = (
  data: Partial<OperatorCompaniesAccessRegisterParams>,
): OperatorCompaniesAccessRegisterParams => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "register operator companies access" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyOperatorCompaniesAccessRegister
