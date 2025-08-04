import Joi from 'joi'
import { SyntheisRequestReceiveMetadata } from 'src/models/dynamo/request-synthesis'
import { TranssatPostbackSynthesisBody, TranssatPostbackSynthesisOcorrencia } from 'src/models/dynamo/transsat/postback-synthesis/body'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema_metadata = Joi.object<SyntheisRequestReceiveMetadata, true>({
  request_id: Joi
    .string()
    .uuid()
    .required(),
  synthesis_id: Joi
    .string()
    .uuid()
    .required(),
  person_id: Joi
    .string()
    .uuid()
    .optional(),
  person_request_id: Joi
    .string()
    .uuid()
    .optional(),
  vehicle_id: Joi
    .string()
    .uuid()
    .optional(),
  vehicle_request_id: Joi
    .string()
    .uuid()
    .optional(),
}).required()

const schema_ocorrencias = Joi.array<TranssatPostbackSynthesisOcorrencia>().items(
  Joi.object<TranssatPostbackSynthesisOcorrencia, true>({
    autor: Joi
      .string()
      .trim()
      .min(1)
      .required(),
    condutor_do_veiculo: Joi
      .string()
      .trim()
      .min(1)
      .required(),
    data: Joi.string()
      .max(32)
      .required(),
    laudo: Joi
      .boolean()
      .required(),
    municipio: Joi
      .string()
      .trim()
      .min(1)
      .required(),
    natureza_ocorrencia: Joi
      .string()
      .trim()
      .min(1)
      .required(),
    numero_nacional_procedimento: Joi
      .string()
      .trim()
      .min(1)
      .required(),
    relato: Joi
      .string()
      .trim()
      .min(1)
      .required(),
    situacao_procedimento: Joi
      .string()
      .trim()
      .min(1)
      .required(),
    testemunha: Joi
      .string()
      .trim()
      .min(1)
      .required(),
    unidade_policial_registro: Joi
      .string()
      .trim()
      .min(1)
      .required(),
    vitima: Joi
      .string()
      .trim()
      .min(1)
      .required(),
  }),
).optional()

const schema = Joi.object<TranssatPostbackSynthesisBody>({
  cpf: Joi
    .string()
    .min(11)
    .max(14)
    .required(),
  data_nascimento: Joi.string()
    .max(32)
    .required(),
  metadata: schema_metadata,
  nome: Joi
    .string()
    .trim()
    .min(1)
    .required(),
  nome_da_mae: Joi
    .string()
    .trim()
    .min(1)
    .required(),
  ocorrencias: schema_ocorrencias,
  quantidade: Joi
    .number()
    .required(),
  referencia: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validateBodyReceiveSynthesis = (
  data: Partial<TranssatPostbackSynthesisBody>,
): TranssatPostbackSynthesisBody => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.debug(data)
    logger.debug(error)
    logger.error('Error on validate "receive synthesis" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyReceiveSynthesis
