import Joi from 'joi'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flag'

import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type FeatureFlagModifyAllowanceValidate = {
  company_id: string
  feature_flags: Array<{
    feature_flag: FeatureFlagsEnum
    enabled: boolean
  }>
}

const schema = Joi.object<FeatureFlagModifyAllowanceValidate, true>({
  company_id: Joi
    .string()
    .uuid()
    .required(),
  feature_flags: Joi.array().items({
    feature_flag: Joi
      .string()
      .valid(...Object.values(FeatureFlagsEnum))
      .required(),
    enabled: Joi
      .boolean()
      .required(),
  }).required(),
}).required()

const validateBody = (
  data: Partial<FeatureFlagModifyAllowanceValidate>,
): FeatureFlagModifyAllowanceValidate => {
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
