import { PersonAnalysisTypeEnum, PersonRegionTypeEnum, StateEnum } from './request-enum'
import { PersonRequestForms } from './request-person'

export interface CompaniesAnalysisContent {
  state?: StateEnum
  name: string[]
  updated_at: string
  request_id: string
}

export interface PersonValidatedContent {
  state?: StateEnum
  approved: boolean
  answer_description: string
  request_id: string
  updated_at: string
}

type PersonRegionTypePrimary = {
  [K in PersonRegionTypeEnum]?: unknown
}

export interface PersonRegionType<T> extends PersonRegionTypePrimary {
  [PersonRegionTypeEnum.STATES]?: T[]
  [PersonRegionTypeEnum.NATIONAL]?: T
}

type PersonAnalysisTypePrimary = {
  [K in PersonAnalysisTypeEnum]?: unknown
}

export interface PersonAnalysisType<T> extends PersonAnalysisTypePrimary {
  [PersonAnalysisTypeEnum.CNH_STATUS]?: T
  [PersonAnalysisTypeEnum.HISTORY]?: PersonRegionType<T>
  [PersonAnalysisTypeEnum.SIMPLE]?: PersonRegionType<T>
}

export interface PersonKey {
  person_id: string
  document: string
}

export interface PersonBody extends Omit<PersonRequestForms, 'document'> {
  companies: PersonAnalysisType<CompaniesAnalysisContent>
  validated: PersonAnalysisType<PersonValidatedContent>
  black_list?: boolean
}

export interface Person extends PersonBody, PersonKey {
  updated_at: string
  created_at: string
}
