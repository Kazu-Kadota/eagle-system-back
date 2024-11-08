import Joi from 'joi'
import { TechmizeV1ConsultarCNHRequestBody, techmizeV1ConsultarCNHTypeRequest } from 'src/models/techmize/v1/consultar-cnh/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeV1ConsultarCNHRequestBody, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(techmizeV1ConsultarCNHTypeRequest)
    .required(),
}).required()

const validateBody = (
  data: Partial<TechmizeV1ConsultarCNHRequestBody>,
): TechmizeV1ConsultarCNHRequestBody => {
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
