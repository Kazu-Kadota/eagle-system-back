import Joi from 'joi'
import { FeatureFlagBody, FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flag'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type FeatureFlagValidate = FeatureFlagKey & FeatureFlagBody

const schema = Joi.object<FeatureFlagValidate>({
  company_id: Joi
    .string()
    .uuid()
    .required(),
  feature_flag: Joi
    .string()
    .valid(...Object.values(FeatureFlagsEnum))
    .required(),
  enabled: Joi
    .boolean()
    .required(),
}).required()

const validateBody = (
  data: Partial<FeatureFlagValidate>,
): FeatureFlagValidate => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "feature flag modify allowance" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBody
