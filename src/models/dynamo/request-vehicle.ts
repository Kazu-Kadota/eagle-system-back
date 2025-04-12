import {
  AnalysisTypeEnum,
  PlateStateEnum,
  RequestStatusEnum,
  VehicleAnalysisTypeEnum,
  VehicleIntegrationPostbackEnum,
  VehicleThirdPartyEnum,
  VehicleType,
} from './request-enum'

export interface VehicleRequestForms {
  chassis?: string
  company_name?: string
  driver_name?: string
  metadata?: Record<any, any>
  owner_document: string
  owner_name: string
  plate_state: PlateStateEnum
  plate: string
  postback?: VehicleIntegrationPostbackEnum
  renavam?: string
  vehicle_model: string
  vehicle_type: VehicleType
}

export interface VehicleRequestKey {
  request_id: string
  vehicle_id: string
}

export interface VehicleRequestBody extends VehicleRequestForms {
  analysis_type: AnalysisTypeEnum
  combo_id?: string
  combo_number?: number
  company_name: string
  status: RequestStatusEnum
  third_party?: VehicleThirdPartyEnum
  user_id: string
  vehicle_analysis_type: VehicleAnalysisTypeEnum
}

export interface VehicleRequest extends VehicleRequestKey, VehicleRequestBody {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
  from_db?: boolean
}

export interface FinishedVehicleRequestBody extends VehicleRequestBody {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
  synthesis_id?: string
  synthesis_request_id?: string
  from_db?: boolean
}

export interface FinishedVehicleRequest extends VehicleRequestKey, FinishedVehicleRequestBody {}
