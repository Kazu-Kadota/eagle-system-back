import Joi from 'joi'
import { AnalysisResultEnum, RequestAnswerBody } from 'src/models/dynamo/answer'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object({
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
}).required()

const validateBody = (
  data: Partial<RequestAnswerBody | undefined>,
): RequestAnswerBody => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate answer analysis')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBody
