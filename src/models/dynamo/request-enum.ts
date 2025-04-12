import { FeatureFlagsEnum } from './feature-flag'

export enum RequestStatusEnum {
  WAITING = 'WAITING',
  PROCESSING = 'PROCESSING',
  FINISHED = 'FINISHED'
}

export enum AnalysisTypeEnum {
  COMBO = 'combo',
  PERSON = 'person',
  VEHICLE = 'vehicle',
  SYNTHESIS = 'synthesis',
}

export enum PersonAnalysisTypeEnum {
  BASIC_DATA = 'basic-data',
  CNH_BASIC = 'cnh-basic',
  CNH_STATUS = 'cnh-status',
  HISTORY = 'history',
  PROCESS = 'process',
  SIMPLE = 'simple',
}

export const is_person_analysis_type_automatic_arr: Array<Omit<PersonAnalysisTypeEnum, PersonAnalysisTypeEnum.SIMPLE | PersonAnalysisTypeEnum.HISTORY>> = [
  PersonAnalysisTypeEnum.BASIC_DATA,
  PersonAnalysisTypeEnum.CNH_BASIC,
  PersonAnalysisTypeEnum.CNH_STATUS,
  PersonAnalysisTypeEnum.PROCESS,
]

export const person_analysis_type_feature_flag_map: Partial<Record<PersonAnalysisTypeEnum, FeatureFlagsEnum>> = {
  [PersonAnalysisTypeEnum.BASIC_DATA]: FeatureFlagsEnum.INFORMATION_ACCESS_PERSON_BASIC_DATA,
  [PersonAnalysisTypeEnum.CNH_BASIC]: FeatureFlagsEnum.INFORMATION_ACCESS_PERSON_CNH_BASIC,
  [PersonAnalysisTypeEnum.CNH_STATUS]: FeatureFlagsEnum.INFORMATION_ACCESS_PERSON_CNH_STATUS,
  [PersonAnalysisTypeEnum.PROCESS]: FeatureFlagsEnum.INFORMATION_ACCESS_PERSON_PROCESS,
}

export enum VehicleAnalysisTypeEnum {
  SIMPLE = 'simple',
  BASIC_DATA = 'basic-data',
  BASIC_DATA_V2 = 'basic-data-v2',
  ANTT = 'antt',
  VEHICLE_PLATE_HISTORY = 'vehicle-plate-history',
  VEHICLE_SECOND_DRIVER = 'vehicle-second-driver'
}

export const is_vehicle_analysis_type_automatic_arr: Array<Omit<VehicleAnalysisTypeEnum, VehicleAnalysisTypeEnum.SIMPLE | VehicleAnalysisTypeEnum.VEHICLE_PLATE_HISTORY | VehicleAnalysisTypeEnum.VEHICLE_SECOND_DRIVER>> = [
  VehicleAnalysisTypeEnum.ANTT,
  VehicleAnalysisTypeEnum.BASIC_DATA,
]

export const vehicle_analysis_type_feature_flag_map: Partial<Record<VehicleAnalysisTypeEnum, FeatureFlagsEnum>> = {
  [VehicleAnalysisTypeEnum.ANTT]: FeatureFlagsEnum.INFORMATION_ACCESS_VEHICLE_ANTT,
  [VehicleAnalysisTypeEnum.BASIC_DATA]: FeatureFlagsEnum.INFORMATION_ACCESS_VEHICLE_BASIC_DATA,
}

export enum PersonRegionTypeEnum {
  STATES = 'states',
  NATIONAL = 'national',
  NATIONAL_DB = 'national + db',
  NATIONAL_STATE = 'national + state',
}

export const person_region_type_feature_flag_map: Partial<Record<PersonRegionTypeEnum, FeatureFlagsEnum>> = {
  [PersonRegionTypeEnum.NATIONAL_DB]: FeatureFlagsEnum.DATABASE_ACCESS_CONSULT,
  [PersonRegionTypeEnum.NATIONAL_STATE]: FeatureFlagsEnum.ACCESS_PERSON_ANALYSIS_REGION_TYPE_NATIONAL_STATE,
}

export enum PersonThirdPartyEnum {
  TECHMIZE = 'techmize',
}

export enum VehicleThirdPartyEnum {
  TECHMIZE = 'techmize',
}

export enum SynthesisThirdPartyEnum {
  TRANSSAT = 'transsat'
}

export enum PersonIntegrationPostbackEnum {
  SCOREPLUS = 'scoreplus',
  M2 = 'm2_system',
}

export enum VehicleIntegrationPostbackEnum {
  SCOREPLUS = 'scoreplus',
  M2 = 'm2',
}

export enum DriverCategoryEnum {
  A = 'A',
  B = 'B',
  AB = 'AB',
  C = 'C',
  D = 'D',
  E = 'E'
}

export enum StateEnum {
  AC = 'AC',
  AL = 'AL',
  AP = 'AP',
  AM = 'AM',
  BA = 'BA',
  CE = 'CE',
  DF = 'DF',
  ES = 'ES',
  GO = 'GO',
  MA = 'MA',
  MT = 'MT',
  MS = 'MS',
  MG = 'MG',
  PA = 'PA',
  PB = 'PB',
  PR = 'PR',
  PE = 'PE',
  PI = 'PI',
  RJ = 'RJ',
  RN = 'RN',
  RS = 'RS',
  RO = 'RO',
  RR = 'RR',
  SC = 'SC',
  SP = 'SP',
  SE = 'SE',
  TO = 'TO',
}

export enum PlateStateEnum {
  AC = 'AC',
  AL = 'AL',
  AP = 'AP',
  AM = 'AM',
  BA = 'BA',
  CE = 'CE',
  DF = 'DF',
  ES = 'ES',
  GO = 'GO',
  MA = 'MA',
  MT = 'MT',
  MS = 'MS',
  MG = 'MG',
  PA = 'PA',
  PB = 'PB',
  PR = 'PR',
  PE = 'PE',
  PI = 'PI',
  RJ = 'RJ',
  RN = 'RN',
  RS = 'RS',
  RO = 'RO',
  RR = 'RR',
  SC = 'SC',
  SP = 'SP',
  SE = 'SE',
  TO = 'TO',
  MERCOSUL = 'MERCOSUL',
}

export enum VehicleType {
  CARRETA = 'CARRETA',
  CAVALO = 'CAVALO'
}
