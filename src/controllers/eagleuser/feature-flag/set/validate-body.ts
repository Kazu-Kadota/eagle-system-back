import Joi from 'joi'
import {
  featureFlagsBodySchemas,
  FeatureFlagsEnum,
  FeatureFlagsWithBody,
} from 'src/models/dynamo/feature-flags/feature-flag'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type FeatureFlagSetValidate<T extends FeatureFlagsWithBody> = {
  company_id: string
  feature_flags: Array<{
    feature_flag: FeatureFlagsEnum
    enabled: boolean
    configs: T extends FeatureFlagsWithBody ? typeof featureFlagsBodySchemas[T]['type'] : unknown
  }>
}

const isKnownFeatureFlag = (
  key: string,
): key is FeatureFlagsWithBody =>
  Object.values(FeatureFlagsEnum).includes(key as FeatureFlagsEnum)
  && key in featureFlagsBodySchemas

const featureFlagSchema = Joi.object({
  feature_flag: Joi
    .string()
    .valid(...Object.values(FeatureFlagsEnum))
    .required(),
  enabled: Joi
    .boolean()
    .required(),
  configs: Joi.any(),
}).custom((value, helpers) => {
  const { feature_flag, configs } = value

  if (isKnownFeatureFlag(feature_flag)) {
    const { error } = featureFlagsBodySchemas[feature_flag].schema.validate(configs)

    if (error) {
      return helpers.error('any.custom', {
        message: `Invalid configs for feature_flag "${feature_flag}": ${error.message}`,
      })
    }
  } else if (configs && Object.keys(configs).length > 0) {
    return helpers.error('any.custom', {
      message: `Feature flag "${feature_flag}" does not support configuration`,
    })
  }

  return value
}, 'Dynamic feature_flag config validation')

const schema = Joi.object({
  company_id: Joi
    .string()
    .uuid()
    .required(),
  feature_flags: Joi.array().items(featureFlagSchema).required(),
}).required()

const validateBody = <T extends FeatureFlagsEnum>(
  data: Partial<FeatureFlagSetValidate<T extends FeatureFlagsWithBody ? T : never>>,
): FeatureFlagSetValidate<T extends FeatureFlagsWithBody ? T : never> => {
  const { value, error } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  })

  if (error) {
    logger.error('Error on validate "set feature flag" body')
    throw new ErrorHandler(error.stack || error.message, 400)
  }

  return value
}

export default validateBody
