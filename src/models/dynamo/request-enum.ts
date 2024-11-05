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
  VEHICLE_PLATE_HISTORY = 'vehicle-plate-history',
  VEHICLE_SECOND_DRIVER = 'vehicle-second-driver'
}

export enum PersonAnalysisTypeEnum {
  BASIC_DATA = 'basic-data',
  CNH_BASIC = 'cnh-basic',
  CNH_STATUS = 'cnh-status',
  HISTORY = 'history',
  PROCESS = 'process',
  SIMPLE = 'simple',
}

export const is_person_analysis_type_automatic = PersonAnalysisTypeEnum.BASIC_DATA
|| PersonAnalysisTypeEnum.CNH_BASIC
|| PersonAnalysisTypeEnum.CNH_STATUS
|| PersonAnalysisTypeEnum.PROCESS

export const personAnalysisTypeFeatureFlagMap: Partial<Record<PersonAnalysisTypeEnum, FeatureFlagsEnum>> = {
  [PersonAnalysisTypeEnum.BASIC_DATA]: FeatureFlagsEnum.INFORMATION_ACCESS_PERSON_BASIC_DATA,
  [PersonAnalysisTypeEnum.CNH_BASIC]: FeatureFlagsEnum.INFORMATION_ACCESS_PERSON_CNH_BASIC,
  [PersonAnalysisTypeEnum.CNH_STATUS]: FeatureFlagsEnum.INFORMATION_ACCESS_PERSON_CNH_STATUS,
  [PersonAnalysisTypeEnum.PROCESS]: FeatureFlagsEnum.INFORMATION_ACCESS_PERSON_PROCESS,
}

export enum VehicleAnalysisTypeEnum {
  BASIC_VEHICLE_INFORMATION = 'basic-vehicle-information',
  ANTT = 'antt',
}

export enum PersonRegionTypeEnum {
  STATES = 'states',
  NATIONAL = 'national',
  NATIONAL_DB = 'national + db'
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
