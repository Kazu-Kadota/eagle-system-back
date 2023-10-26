import Joi from 'joi'
import { AnalysisPathTypeEnum } from 'src/models/dynamo/answer'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export interface RequestPersonByDocumentPath {
  path_type: AnalysisPathTypeEnum
}

const schema = Joi.object({
  path_type: Joi
    .string()
    .valid(...Object.values(AnalysisPathTypeEnum))
    .required(),
}).required()

const validatePath = (
  data: Partial<RequestPersonByDocumentPath | undefined>,
): RequestPersonByDocumentPath => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate path of query person by document email request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validatePath
