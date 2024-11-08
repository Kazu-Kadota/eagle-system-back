import {
  AnalysisTypeEnum,
  PlateStateEnum,
  RequestStatusEnum,
  VehicleAnalysisTypeEnum,
} from './request-enum'
import { VehicleRequestKey } from './request-vehicle'

export interface VehicleRequestPlateHistoryForms {
  company_name?: string
  owner_document: string
  owner_name: string
  plate_state: PlateStateEnum
  plate: string
}

export interface VehicleRequestPlateHistoryBody extends VehicleRequestPlateHistoryForms {
  analysis_type: AnalysisTypeEnum
  user_id: string
  company_name: string
  status: RequestStatusEnum
  vehicle_analysis_type: VehicleAnalysisTypeEnum.VEHICLE_PLATE_HISTORY
}

export interface VehiclePlateHistoryRequest extends VehicleRequestKey, VehicleRequestPlateHistoryBody {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
  from_db?: boolean
}

export interface FinishedVehicleRequestPlateHistoryBody extends VehicleRequestPlateHistoryBody {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
  from_db?: boolean
}

export interface FinishedVehicleRequestPlateHistory extends VehicleRequestKey, FinishedVehicleRequestPlateHistoryBody {}
