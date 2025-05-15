import { Timestamp } from '../timestamp'

import {
  featureFlagsBodySchemas,
  FeatureFlagsEnum,
  FeatureFlagsWithBody,
} from './feature-flag'

// Schema from DB is not right. Currently we do modification directly in DB, we don't use any route to define BFF

export type FeatureFlagBFFGeneralInformation = {
  label: string
  'place-holder': string
  type: string
  name: string
}

export type FeatureFlagsBFFBodySchemas = {
  [K in FeatureFlagsWithBody]: typeof featureFlagsBodySchemas[K]['bff_type']
}

export type FeatureFlagBFFConfigBody<T extends FeatureFlagsEnum> = T extends FeatureFlagsWithBody ? FeatureFlagsBFFBodySchemas[T] : never

export type FeatureFlagBFFBody <T extends FeatureFlagsEnum> = FeatureFlagBFFConfigBody<T> & {}

export type FeatureFlagBFFKey = {
  feature_flag: FeatureFlagsEnum
}

export type FeatureFlagBFF <T extends FeatureFlagsEnum> = FeatureFlagBFFKey & FeatureFlagBFFBody<T> & Timestamp & {}
