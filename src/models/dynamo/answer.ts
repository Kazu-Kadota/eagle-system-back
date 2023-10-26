export enum AnalysisResultEnum {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum AnalysisPathTypeEnum {
  PERSON = 'person',
  VEHICLE = 'vehicle',
}

export interface RequestAnswerBody {
  analysis_result: AnalysisResultEnum
  analysis_info?: string
}

export interface RequestAnswerPath {
  analysis_type: AnalysisPathTypeEnum
  id: string
}
