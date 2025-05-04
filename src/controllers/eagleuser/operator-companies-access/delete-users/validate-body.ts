import Joi from 'joi'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type OperatorCompaniesAccessDeleteParams = {
  user_ids: Array<string>
}

const schema = Joi.object<OperatorCompaniesAccessDeleteParams>({
  user_ids: Joi.array<Array<string>>().items(
    Joi.string()
      .uuid()
      .required(),
  ),
}).required()

const validateBodyOperatorCompaniesAccessDeleteUsers = (
  data: Partial<OperatorCompaniesAccessDeleteParams>,
): OperatorCompaniesAccessDeleteParams => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "operator companies access delete users" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyOperatorCompaniesAccessDeleteUsers
