import Joi from 'joi'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const documentRegex = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/

export interface RequestPersonByDocumentQuery {
  document: string
  company_name?: string
}

const schema = Joi.object({
  document: Joi
    .string()
    .regex(documentRegex)
    .required(),
  company_name: Joi
    .string()
    .optional(),
}).required()

const validateQueryPerson = (
  data: Partial<RequestPersonByDocumentQuery | undefined>,
): RequestPersonByDocumentQuery => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate query string of query person by document email request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateQueryPerson
