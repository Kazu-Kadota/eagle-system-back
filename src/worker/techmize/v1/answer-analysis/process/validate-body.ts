import Joi from 'joi'
import { TechmizeV1ConsultarProcessosRequestBody, techmizeV1ConsultarProcessosTypeRequest } from 'src/models/techmize/v1/consultar-processos/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeV1ConsultarProcessosRequestBody, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(techmizeV1ConsultarProcessosTypeRequest)
    .required(),
}).required()

const validateBody = (
  data: Partial<TechmizeV1ConsultarProcessosRequestBody>,
): TechmizeV1ConsultarProcessosRequestBody => {
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
