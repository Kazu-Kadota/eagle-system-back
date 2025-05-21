import Joi from 'joi'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type validateQueryByCompany = {
  company_name?: string
  start_date: string
  end_date: string
}

const schema = Joi.object<validateQueryByCompany, true>({
  company_name: Joi
    .string()
    .max(255)
    .optional(),
  start_date: Joi
    .string()
    .isoDate()
    .required(),
  end_date: Joi
    .string()
    .isoDate()
    .required(),
}).required()

const validateSynthesisQuery = (
  data: Partial<validateQueryByCompany | undefined>,
): validateQueryByCompany => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "synthesis query by company" request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateSynthesisQuery
