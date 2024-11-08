import {
  AnalysisTypeEnum,
  PlateStateEnum,
  RequestStatusEnum,
  VehicleAnalysisTypeEnum,
} from './request-enum'
import { VehicleRequestKey } from './request-vehicle'

export type VehicleRequestAnalysisTypeForms = {
  company_name?: string
  owner_document: string
  owner_name: string
  plate_state: PlateStateEnum
  plate: string
}

export type VehicleRequestAnalysisTypeBody = VehicleRequestAnalysisTypeForms & {
  analysis_type: AnalysisTypeEnum
  user_id: string
  company_name: string
  status: RequestStatusEnum
  vehicle_analysis_type: Omit<VehicleAnalysisTypeEnum, VehicleAnalysisTypeEnum.VEHICLE_PLATE_HISTORY | VehicleAnalysisTypeEnum.VEHICLE_SECOND_DRIVER>
}

export type VehicleAnalysisTypeRequest = VehicleRequestKey & VehicleRequestAnalysisTypeBody & {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
  from_db?: boolean
}

export type FinishedVehicleRequestAnalysisTypeBody = VehicleRequestAnalysisTypeBody & {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
  from_db?: boolean
}

export type FinishedVehicleRequestAnalysisType = VehicleRequestKey & FinishedVehicleRequestAnalysisTypeBody & {}
