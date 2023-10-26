import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export interface ValidatePersonParam {
  person_id: string
}

const schema = Joi.object({
  person_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validatePersonParam = (
  data: Partial<ValidatePersonParam | undefined>,
): ValidatePersonParam => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "request person" query')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validatePersonParam
