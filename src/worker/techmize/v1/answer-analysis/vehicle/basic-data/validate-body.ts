import Joi from 'joi'
import { TechmizeV1ConsultarDadosBasicosVeiculoRequestBody, techmizeV1ConsultarDadosBasicosVeiculoTypeRequest } from 'src/models/techmize/v1/consultar-dados-basicos-veiculo/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const plateRegex = /^([A-Za-z0-9]{7})$/
const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeV1ConsultarDadosBasicosVeiculoRequestBody, true>({
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
    .valid(techmizeV1ConsultarDadosBasicosVeiculoTypeRequest)
    .required(),
}).required()

const validateBody = (
  data: Partial<TechmizeV1ConsultarDadosBasicosVeiculoRequestBody>,
): TechmizeV1ConsultarDadosBasicosVeiculoRequestBody => {
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
