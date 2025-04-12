import Joi from 'joi'
import { techmizeV2ConsultarDadosBasicosVeiculoTypeRequest } from 'src/models/techmize/v2/consultar-dados-basicos-veiculo/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

import { TechmizeNewV1AnswerAnalysisVehicleBasicDataBodyValue } from './main'

const plateRegex = /^([A-Za-z0-9]{7})$/

const schema = Joi.object<TechmizeNewV1AnswerAnalysisVehicleBasicDataBodyValue, true>({
  plate: Joi
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
    .max(50),
  retry: Joi
    .boolean()
    .optional(),
}).required()

const validateBody = (
  data: Partial<TechmizeNewV1AnswerAnalysisVehicleBasicDataBodyValue>,
): TechmizeNewV1AnswerAnalysisVehicleBasicDataBodyValue => {
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
