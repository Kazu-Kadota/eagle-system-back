import Joi from 'joi'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type FeatureFlagBFFDeleteValidate = {
  feature_flag: FeatureFlagsEnum
}

const schema = Joi.object({
  feature_flag: Joi
    .string()
    .valid(...Object.values(FeatureFlagsEnum))
    .required(),
}).required()

const validateBody = (
  data: Partial<FeatureFlagBFFDeleteValidate>,
): FeatureFlagBFFDeleteValidate => {
  const { value, error } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  })

  if (error) {
    logger.error('Error on validate "delete feature flag bff" body')
    throw new ErrorHandler(error.stack || error.message, 400)
  }

  return value
}

export default validateBody
