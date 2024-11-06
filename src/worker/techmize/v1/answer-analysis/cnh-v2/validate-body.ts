import Joi from 'joi'
import { TechmizeV1ConsultarCNHV2RequestBody, techmizeV1ConsultarCNHV2TypeRequest } from 'src/models/techmize/v1/consultar-cnh-v2/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeV1ConsultarCNHV2RequestBody, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(techmizeV1ConsultarCNHV2TypeRequest)
    .required(),
}).required()

const validateBody = (
  data: Partial<TechmizeV1ConsultarCNHV2RequestBody>,
): TechmizeV1ConsultarCNHV2RequestBody => {
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
