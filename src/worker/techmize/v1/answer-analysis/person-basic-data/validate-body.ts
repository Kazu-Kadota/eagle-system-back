import Joi from 'joi'
import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody } from 'src/models/techmize/v1/consultar-dados-basicos-pessoa-fisica/request-body'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const documentRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/

const schema = Joi.object<TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody, true>({
  cpf: Joi
    .string()
    .regex(documentRegex)
    .required(),
  type_request: Joi
    .string()
    .valid(PersonAnalysisTypeEnum.BASIC_DATA)
    .required(),
}).required()

const validateBody = (
  data: Partial<TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody>,
): TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody => {
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
