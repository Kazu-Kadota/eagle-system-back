import Joi from 'joi'
import { techmizeV2ConsultarDadosBasicosVeiculoTypeRequest } from 'src/models/techmize/v2/consultar-dados-basicos-veiculo/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { TechmizeV2AnswerAnalysisVehicleBasicDataBodyValue } from './main'

const plateRegex = /^([A-Za-z0-9]{7})$/
const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeV2AnswerAnalysisVehicleBasicDataBodyValue, true>({
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
    .valid(techmizeV2ConsultarDadosBasicosVeiculoTypeRequest)
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
  data: Partial<TechmizeV2AnswerAnalysisVehicleBasicDataBodyValue>,
): TechmizeV2AnswerAnalysisVehicleBasicDataBodyValue => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error({
      message: 'Error on validate vehicle basic data',
    })

    throw new ErrorHandler('Erro na validação do body para consulta básica de veículo', 500, [error.stack])
  }

  return value
}

export default validateBody
