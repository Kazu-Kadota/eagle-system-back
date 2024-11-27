import { PersonAnalysisTypeEnum, PersonRegionTypeEnum, StateEnum } from './request-enum'
import { PersonRequestForms } from './request-person'

export type CompaniesAnalysisContent = {
  state?: StateEnum
  name: string[]
  updated_at: string
  request_id: string
}

export type PersonValidatedContent = {
  state?: StateEnum
  approved: boolean
  answer_description: string
  request_id: string
  updated_at: string
}

type PersonRegionTypePrimary = {
  [K in PersonRegionTypeEnum]?: unknown
}

export type PersonRegionType<T> = PersonRegionTypePrimary & {
  [PersonRegionTypeEnum.STATES]?: T[]
  [PersonRegionTypeEnum.NATIONAL]?: T
}

type PersonAnalysisTypePrimary<T> = {
  [K in PersonAnalysisTypeEnum]?: T
}

export type PersonAnalysisType<T> = PersonAnalysisTypePrimary<T> & {
  [PersonAnalysisTypeEnum.HISTORY]?: PersonRegionType<T>
  [PersonAnalysisTypeEnum.SIMPLE]?: PersonRegionType<T>
}

export type PersonKey = {
  person_id: string
  document: string
}

export type PersonBody = Omit<PersonRequestForms, 'document'> & {
  companies: PersonAnalysisType<CompaniesAnalysisContent>
  validated: PersonAnalysisType<PersonValidatedContent>
  black_list?: boolean
}

export type Person = PersonBody & PersonKey & {
  updated_at: string
  created_at: string
}
