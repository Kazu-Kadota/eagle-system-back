import Joi from 'joi'
import { FeatureFlagKey, FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const schema = Joi.object<Partial<FeatureFlagKey>, true>({
  company_id: Joi
    .string()
    .uuid()
    .required(),
  feature_flag: Joi
    .string()
    .valid(...Object.values(FeatureFlagsEnum))
    .optional(),
}).required()

const validateQuery = (
  data: Partial<FeatureFlagKey>,
): Partial<FeatureFlagKey> => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "query company feature flag config" query')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateQuery
