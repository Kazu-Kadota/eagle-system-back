import Joi from 'joi'

import { FeatureFlagBFFGeneralInformation } from './feature-flag-bff'

export type FeatureFlagConfigSynthesisBody = {
  range_date_limit: number
}

export const featureFlagBodySynthesisJOISchema = Joi.object<FeatureFlagConfigSynthesisBody, true>({
  range_date_limit: Joi.number().min(1).default(30).max(10000).required(),
})

// Not in use. Definition is done directly in DB
export type FeatureFlagBFFSynthesisBodyValueType = FeatureFlagBFFGeneralInformation & {}

export type FeatureFlagBFFSynthesisBody = {
  [K in keyof FeatureFlagConfigSynthesisBody]: FeatureFlagBFFSynthesisBodyValueType
}

export const featureFlagBFFBodySynthesisJOISchema = Joi.object<FeatureFlagBFFSynthesisBody, true>({
  range_date_limit: Joi.object<FeatureFlagBFFSynthesisBodyValueType, true>({
    'place-holder': Joi.string().max(255).required(),
    label: Joi.string().max(255).required(),
    name: Joi.string().max(255).required(),
    type: Joi.string().max(255).required(),
  }),
})

export const featureFlagSynthesisBodySchema = {
  schema: featureFlagBodySynthesisJOISchema,
  type: {} as FeatureFlagConfigSynthesisBody,
  bff_schema: featureFlagBFFBodySynthesisJOISchema,
  bff_type: {} as FeatureFlagBFFSynthesisBody,
}
