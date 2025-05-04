import Joi from 'joi'
import { PersonRequestKey } from 'src/models/dynamo/request-person'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object<PersonRequestKey, true>({
  person_id: Joi
    .string()
    .uuid()
    .optional(),
  request_id: Joi
    .string()
    .uuid()
    .optional(),
}).required()

const validateBodyDeleteWaitingAnalysisPerson = (
  data: Partial<PersonRequestKey>,
): PersonRequestKey => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "delete waiting analysis person" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyDeleteWaitingAnalysisPerson
