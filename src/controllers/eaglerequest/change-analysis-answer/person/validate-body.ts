import Joi from 'joi'
import { PersonRequestKey } from 'src/models/dynamo/request-person'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type ChangeAnalysisAnswerPersonParams = PersonRequestKey & {
  analysis_info: string
}

const schema = Joi.object<ChangeAnalysisAnswerPersonParams, true>({
  person_id: Joi
    .string()
    .uuid()
    .optional(),
  request_id: Joi
    .string()
    .uuid()
    .optional(),
  analysis_info: Joi
    .string()
    .required(),
}).required()

const validateBodyChangeAnalysisAnswerPerson = (
  data: Partial<ChangeAnalysisAnswerPersonParams>,
): ChangeAnalysisAnswerPersonParams => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "change analysis answer person" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyChangeAnalysisAnswerPerson
