export enum RequestStatusEnum {
  WAITING = 'WAITING',
  PROCESSING = 'PROCESSING',
  FINISHED = 'FINISHED'
}

export enum AnalysisTypeEnum {
  COMBO = 'combo',
  PERSON = 'person',
  VEHICLE = 'vehicle',
  VEHICLE_PLATE_HISTORY = 'vehicle-plate-history'
}

export enum PersonAnalysisTypeEnum {
  SIMPLE = 'simple',
  HISTORY = 'history',
  CNH_STATUS = 'cnh-status'
}

export enum PersonRegionTypeEnum {
  STATES = 'states',
  NATIONAL = 'national'
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
