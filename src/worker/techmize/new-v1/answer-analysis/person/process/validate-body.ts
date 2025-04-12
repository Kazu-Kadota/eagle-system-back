import Joi from 'joi'
import { techmizeV2ConsultarProcessosTypeRequest } from 'src/models/techmize/v2/consultar-processos/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { TechmizeNewV1AnswerAnalysisProcessBodyValue } from './main'

const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeNewV1AnswerAnalysisProcessBodyValue, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(techmizeV2ConsultarProcessosTypeRequest)
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
  data: Partial<TechmizeNewV1AnswerAnalysisProcessBodyValue>,
): TechmizeNewV1AnswerAnalysisProcessBodyValue => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error({
      message: 'Error on validate process',
    })

    throw new ErrorHandler('Erro na validação do body para consulta de processos', 500, [error.stack])
  }

  return value
}

export default validateBody
