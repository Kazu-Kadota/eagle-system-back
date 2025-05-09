import Joi from 'joi'
import { FeatureFlagsEnum } from 'src/models/dynamo/feature-flags/feature-flag'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

export type DeleteFeatureFlagParams = {
  company_id: string
  feature_flag: Array<FeatureFlagsEnum>
}

const schema = Joi.object<DeleteFeatureFlagParams, true>({
  company_id: Joi
    .string()
    .uuid()
    .required(),
  feature_flag: Joi.array<Array<FeatureFlagsEnum>>().items(
    Joi.string()
      .valid(...Object.values(FeatureFlagsEnum))
      .required(),
  ),
}).required()

const validateBody = (
  data: Partial<DeleteFeatureFlagParams>,
): DeleteFeatureFlagParams => {
  const { value, error } = schema.validate(data, {
    abortEarly: true,
  })

  if (error) {
    logger.error('Error on validate "delete company feature flag config" body')

    throw new ErrorHandler(error.stack as string, 400)
  }

  return value
}

export default validateBody
