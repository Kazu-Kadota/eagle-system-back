import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type ValidateReportQuery = {
  start_date: string
  final_date: string
  company?: string
  summary: boolean
}

const schema = Joi.object<ValidateReportQuery, true>({
  start_date: Joi
    .string()
    .isoDate()
    .required(),
  final_date: Joi
    .string()
    .isoDate()
    .required(),
  company: Joi
    .string()
    .max(255)
    .optional(),
  summary: Joi
    .boolean()
    .default(true)
    .required(),
}).required()

const validateReportQuery = (
  data: Partial<ValidateReportQuery>,
): ValidateReportQuery => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate request report synthesis')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateReportQuery
