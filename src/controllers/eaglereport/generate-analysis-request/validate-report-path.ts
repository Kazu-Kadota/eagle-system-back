import Joi from 'joi'
import { AnalysisPathTypeEnum } from 'src/models/dynamo/answer'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export interface ReportPath {
  path_type: string
}

const schema = Joi.object({
  path_type: Joi
    .string()
    .valid(...Object.values(AnalysisPathTypeEnum))
    .required(),
}).required()

const validateReportPath = (
  data: Partial<ReportPath | undefined>,
): ReportPath => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate generate report path')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateReportPath
