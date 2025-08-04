import Joi from 'joi'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type ValidateQueryByDocumentParams = {
  document: string
  company_name?: string
}

const documentRegex = /^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2})$/

const schema = Joi.object<ValidateQueryByDocumentParams, true>({
  company_name: Joi
    .string()
    .min(3)
    .max(128)
    .optional(),
  document: Joi
    .string()
    .regex(documentRegex)
    .required(),
}).required()

const validateSynthesisQuery = (
  data: Partial<ValidateQueryByDocumentParams | undefined>,
): ValidateQueryByDocumentParams => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "synthesis query by document" request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateSynthesisQuery
