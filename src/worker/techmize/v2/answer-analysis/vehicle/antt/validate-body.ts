import Joi from 'joi'
import { techmizeV2ConsultarANTTTypeRequest } from 'src/models/techmize/v2/consultar-antt/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { TechmizeV2AnswerAnalysisVehicleANTTBodyValue } from './main'

const plateRegex = /^([A-Za-z0-9]{7})$/
const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeV2AnswerAnalysisVehicleANTTBodyValue, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  licenseplate: Joi
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
    .max(30),
  retry: Joi
    .boolean()
    .optional(),
}).required()

const validateBody = (
  data: Partial<TechmizeV2AnswerAnalysisVehicleANTTBodyValue>,
): TechmizeV2AnswerAnalysisVehicleANTTBodyValue => {
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
