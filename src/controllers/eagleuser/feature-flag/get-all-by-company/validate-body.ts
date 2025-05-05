import Joi from 'joi'
import { FeatureFlagKey } from 'src/models/dynamo/feature-flag'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type FeatureFlagValidate = Omit<FeatureFlagKey, 'feature_flag'>

const schema = Joi.object<FeatureFlagValidate, true>({
  company_id: Joi
    .string()
    .uuid()
    .required(),
}).required()

const validateBody = (
  data: Partial<FeatureFlagValidate>,
): FeatureFlagValidate => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "get all feature flag" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBody
