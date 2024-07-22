export enum FeatureFlagsEnum {
  DATABASE_ACCESS_CONSULT = 'database_access_consult',
}

export type FeatureFlagKey = {
  company_id: string
  feature_flag: FeatureFlagsEnum
}

export type FeatureFlagBody = {
  enabled: boolean
}

export type FeatureFlag = FeatureFlagKey & FeatureFlagBody & {
  created_at: string
  updated_at: string
}
