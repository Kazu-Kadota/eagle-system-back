import Joi from 'joi'
import {
  featureFlagsBodySchemas,
  FeatureFlagsEnum,
  FeatureFlagsWithBody,
} from 'src/models/dynamo/feature-flags/feature-flag'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type FeatureFlagBFFUpdateValidate<T extends FeatureFlagsWithBody> = {
  feature_flag: FeatureFlagsEnum
  bff: T extends FeatureFlagsWithBody ? typeof featureFlagsBodySchemas[T]['bff_type'] : unknown
}

const isKnownFeatureFlag = (
  key: string,
): key is FeatureFlagsWithBody =>
  Object.values(FeatureFlagsEnum).includes(key as FeatureFlagsEnum)
  && key in featureFlagsBodySchemas

const schema = Joi.object({
  feature_flag: Joi
    .string()
    .valid(...Object.values(FeatureFlagsEnum))
    .required(),
  bff: Joi.any(),
}).custom((value, helpers) => {
  const { feature_flag, bff } = value

  if (isKnownFeatureFlag(feature_flag)) {
    const { error } = featureFlagsBodySchemas[feature_flag].bff_schema.validate(bff)

    if (error) {
      return helpers.error('any.custom', {
        message: `Invalid bff for feature_flag "${feature_flag}": ${error.message}`,
      })
    }
  } else if (bff && Object.keys(bff).length > 0) {
    return helpers.error('any.custom', {
      message: `Feature flag "${feature_flag}" does not support configuration`,
    })
  }

  return value
}, 'Dynamic feature_flag config validation').required()

const validateBody = <T extends FeatureFlagsEnum>(
  data: Partial<FeatureFlagBFFUpdateValidate<T extends FeatureFlagsWithBody ? T : never>>,
): FeatureFlagBFFUpdateValidate<T extends FeatureFlagsWithBody ? T : never> => {
  const { value, error } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  })

  if (error) {
    logger.error('Error on validate "update feature flag bff" body')
    throw new ErrorHandler(error.stack || error.message, 400)
  }

  return value
}

export default validateBody
