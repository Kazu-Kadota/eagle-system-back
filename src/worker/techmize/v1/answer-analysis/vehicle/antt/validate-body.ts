import Joi from 'joi'
import { TechmizeV1ConsultarANTTRequestBody, techmizeV1ConsultarANTTTypeRequest } from 'src/models/techmize/v1/consultar-antt/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const plateRegex = /^([A-Za-z0-9]{7})$/
const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeV1ConsultarANTTRequestBody, true>({
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
    .valid(techmizeV1ConsultarANTTTypeRequest)
    .required(),
}).required()

const validateBody = (
  data: Partial<TechmizeV1ConsultarANTTRequestBody>,
): TechmizeV1ConsultarANTTRequestBody => {
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
