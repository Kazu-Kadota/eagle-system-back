import Joi from 'joi'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type MyCompanyQueryParams = {
  feature_flag?: boolean
}

const schema = Joi.object<MyCompanyQueryParams>({
  feature_flag: Joi.boolean().optional(),
}).required()

const validateQuery = (
  data: Partial<MyCompanyQueryParams>,
): MyCompanyQueryParams => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "my company" query')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateQuery
