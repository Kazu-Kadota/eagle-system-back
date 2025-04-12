import Joi from 'joi'
import { techmizeV2ConsultarCNHV2TypeRequest } from 'src/models/techmize/v2/consultar-cnh-v2/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { TechmizeNewV1AnswerAnalysisCNHV2BodyValue } from './main'

const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeNewV1AnswerAnalysisCNHV2BodyValue, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(techmizeV2ConsultarCNHV2TypeRequest)
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
  data: Partial<TechmizeNewV1AnswerAnalysisCNHV2BodyValue>,
): TechmizeNewV1AnswerAnalysisCNHV2BodyValue => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error({
      message: 'Error on validate cnh v2',
    })

    throw new ErrorHandler('Erro na validação do body para consulta de status do cnh', 500, [error.stack])
  }

  return value
}

export default validateBody
