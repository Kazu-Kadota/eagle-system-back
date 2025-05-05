import Joi from 'joi'
import { AnalysisResultEnum, RequestAnswerBody } from 'src/models/dynamo/answer'
import { PersonRequestKey } from 'src/models/dynamo/request-person'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type ChangeAnalysisAnswerPersonParams = PersonRequestKey & RequestAnswerBody

const schema = Joi.object<ChangeAnalysisAnswerPersonParams, true>({
  person_id: Joi
    .string()
    .uuid()
    .required(),
  request_id: Joi
    .string()
    .uuid()
    .required(),
  analysis_result: Joi
    .string()
    .valid(...Object.values(AnalysisResultEnum))
    .required(),
  analysis_info: Joi
    .string()
    .when('analysis_result', {
      is: 'REJECTED',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  from_db: Joi
    .boolean()
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
