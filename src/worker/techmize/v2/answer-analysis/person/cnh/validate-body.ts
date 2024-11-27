import Joi from 'joi'
import { techmizeV2ConsultarCNHTypeRequest } from 'src/models/techmize/v2/consultar-cnh/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { TechmizeV2AnswerAnalysisCNHBodyValue } from './main'

const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeV2AnswerAnalysisCNHBodyValue, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(techmizeV2ConsultarCNHTypeRequest)
    .required(),
  protocol: Joi
    .string()
    .min(20)
    .max(30),
  retry: Joi
    .boolean()
    .optional(),
}).required()

const validateBody = (
  data: Partial<TechmizeV2AnswerAnalysisCNHBodyValue>,
): TechmizeV2AnswerAnalysisCNHBodyValue => {
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
