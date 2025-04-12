import Joi from 'joi'
import { SyntheisRequestReceiveMetadata, SyntheisRequestReceiveParams } from 'src/models/dynamo/request-synthesis'

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

const schema = Joi.object<SyntheisRequestReceiveParams, true>({
  metadata: schema_metadata,
  texto: Joi
    .string()
    .base64()
    .required(),
}).required()

const validateBodyReceiveSynthesis = (
  data: Partial<SyntheisRequestReceiveParams>,
): SyntheisRequestReceiveParams => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "receive synthesis" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBodyReceiveSynthesis
