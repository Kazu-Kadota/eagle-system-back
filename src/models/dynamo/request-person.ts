import {
  AnalysisTypeEnum,
  DriverCategoryEnum,
  PersonAnalysisTypeEnum,
  PersonIntegrationPostbackEnum,
  PersonRegionTypeEnum,
  PersonThirdPartyEnum,
  RequestStatusEnum,
  StateEnum,
} from './request-enum'

export interface PersonRequestForms {
  birth_date: string
  category_cnh?: DriverCategoryEnum
  cnh?: string
  company_name?: string
  document: string
  expire_at_cnh?: string
  father_name?: string
  metadata?: Record<any, any>
  mother_name: string
  name: string
  naturalness?: string
  rg: string
  security_number_cnh?: string
  state_rg: StateEnum
  postback?: PersonIntegrationPostbackEnum
}

export interface PersonAnalysisItems {
  type: PersonAnalysisTypeEnum
  region_types: PersonRegionTypeEnum[]
  regions: StateEnum[]
}

export interface PersonRequestAnalysis {
  person_analysis: PersonAnalysisItems[]
  person: PersonRequestForms
}

export interface PersonRequestKey {
  person_id: string
  request_id: string
}

export interface PersonRequestBody extends PersonRequestForms {
  analysis_type: AnalysisTypeEnum
  combo_id?: string
  combo_number?: number
  company_name: string
  person_analysis_type: PersonAnalysisTypeEnum
  region_type?: PersonRegionTypeEnum
  region?: StateEnum
  status: RequestStatusEnum
  third_party?: PersonThirdPartyEnum
  user_id: string
}

export interface PersonRequest extends PersonRequestKey, PersonRequestBody {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
  synthesis_id?: string
  synthesis_request_id?: string
  from_db?: boolean
}
