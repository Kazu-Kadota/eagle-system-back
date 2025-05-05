import { Timestamp } from './timestamp'

export enum FeatureFlagsEnum {
  ACCESS_PERSON_ANALYSIS_REGION_TYPE_NATIONAL_STATE = 'access_person_analysis_region_type_national_state',
  SYNTHESIS_INFORMATION_ACCESS = 'synthesis_information_access',
  DATABASE_ACCESS_CONSULT = 'database_access_consult',
  INFORMATION_ACCESS_PERSON_CNH_BASIC = 'information_access_person_cnh_basic',
  INFORMATION_ACCESS_PERSON_CNH_STATUS = 'information_access_person_cnh_status',
  INFORMATION_ACCESS_PERSON_PROCESS = 'information_access_person_process',
  INFORMATION_ACCESS_PERSON_BASIC_DATA = 'information_access_person_basic_data',
  INFORMATION_ACCESS_VEHICLE_ANTT = 'information_access_vehicle_antt',
  INFORMATION_ACCESS_VEHICLE_BASIC_DATA = 'information_access_vehicle_basic_data',
}

export type FeatureFlagKey = {
  company_id: string
  feature_flag: FeatureFlagsEnum
}

export type FeatureFlagBody = {
  enabled: boolean
}

export type FeatureFlag = FeatureFlagKey & FeatureFlagBody & Timestamp & {}
