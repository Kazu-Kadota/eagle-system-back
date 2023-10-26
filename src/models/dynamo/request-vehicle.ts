import {
  AnalysisTypeEnum,
  PlateStateEnum,
  RequestStatusEnum,
  VehicleType,
} from './request-enum'

export interface VehicleRequestForms {
  chassis?: string
  company_name?: string
  driver_name?: string
  owner_document: string
  owner_name: string
  plate_state: PlateStateEnum
  plate: string
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
  combo_number?: number
  user_id: string
  company_name: string
  status: RequestStatusEnum
}

export interface VehicleRequest extends VehicleRequestKey, VehicleRequestBody {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
}

export interface FinishedVehicleRequestBody extends VehicleRequestBody {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
}

export interface FinishedVehicleRequest extends VehicleRequestKey, FinishedVehicleRequestBody {}
