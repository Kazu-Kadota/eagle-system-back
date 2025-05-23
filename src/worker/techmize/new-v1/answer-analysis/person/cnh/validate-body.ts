import Joi from 'joi'
import { techmizeNewV1CNHTypeRequest } from 'src/models/techmize/new-v1/cnh/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { TechmizeNewV1AnswerAnalysisCNHBodyValue } from './main'

const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeNewV1AnswerAnalysisCNHBodyValue, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(techmizeNewV1CNHTypeRequest)
    .required(),
  protocol: Joi
    .string()
    .min(20)
    .max(50),
  retry: Joi
    .boolean()
    .optional(),
}).required()

const validateBody = (
  data: Partial<TechmizeNewV1AnswerAnalysisCNHBodyValue>,
): TechmizeNewV1AnswerAnalysisCNHBodyValue => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error({
      message: 'Error on validate cnh',
    })

    throw new ErrorHandler('Erro na validação do body para consulta de cnh', 500, [error.stack])
  }

  return value
}

export default validateBody
