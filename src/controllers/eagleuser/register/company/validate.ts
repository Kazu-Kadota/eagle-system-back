import Joi from 'joi'
import { CompanyBody, CompanyTypeEnum } from 'src/models/dynamo/company'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const cnpjRegex = /^([0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/

const schema = Joi.object({
  cnpj: Joi
    .string()
    .regex(cnpjRegex)
    .required(),
  name: Joi
    .string()
    .max(255)
    .required(),
  type: Joi
    .string()
    .valid(...Object.values(CompanyTypeEnum))
    .required(),
}).required()

const validateRegisterCompany = (
  data: Partial<CompanyBody>,
): CompanyBody => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate register request')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateRegisterCompany
