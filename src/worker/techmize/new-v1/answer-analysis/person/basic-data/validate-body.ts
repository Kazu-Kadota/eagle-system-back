import Joi from 'joi'
import { techmizeV2ConsultarDadosBasicosPessoaFisicaTypeRequest } from 'src/models/techmize/v2/consultar-dados-basicos-pessoa-fisica/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { TechmizeNewV1AnswerAnalysisPersonBasicDataBodyValue } from './main'

const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeNewV1AnswerAnalysisPersonBasicDataBodyValue, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(techmizeV2ConsultarDadosBasicosPessoaFisicaTypeRequest)
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
  data: Partial<TechmizeNewV1AnswerAnalysisPersonBasicDataBodyValue>,
): TechmizeNewV1AnswerAnalysisPersonBasicDataBodyValue => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error({
      message: 'Error on validate person basic data',
    })

    throw new ErrorHandler('Erro na validação do body para consulta básica de pessoa', 500, [error.stack])
  }

  return value
}

export default validateBody
