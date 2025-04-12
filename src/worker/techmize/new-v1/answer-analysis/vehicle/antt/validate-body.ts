import Joi from 'joi'
import { techmizeV2ConsultarANTTTypeRequest } from 'src/models/techmize/v2/consultar-antt/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { TechmizeNewV1AnswerAnalysisVehicleANTTBodyValue } from './main'

const plateRegex = /^([A-Za-z0-9]{7})$/
const documentRegex = /^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2})$/

const schema = Joi.object<TechmizeNewV1AnswerAnalysisVehicleANTTBodyValue, true>({
  cpf_cnpj: Joi
    .string()
    .regex(documentRegex)
    .required(),
  plate: Joi
    .string()
    .regex(plateRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(techmizeV2ConsultarANTTTypeRequest)
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
  data: Partial<TechmizeNewV1AnswerAnalysisVehicleANTTBodyValue>,
): TechmizeNewV1AnswerAnalysisVehicleANTTBodyValue => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error({
      message: 'Error on validate antt',
    })

    throw new ErrorHandler('Erro na validação do body para consulta de antt', 500, [error.stack])
  }

  return value
}

export default validateBody
