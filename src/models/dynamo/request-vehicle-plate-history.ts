import {
  AnalysisTypeEnum,
  PlateStateEnum,
  RequestStatusEnum,
  StateEnum,
  VehicleAnalysisTypeEnum,
  VehicleIntegrationPostbackEnum,
  VehicleThirdPartyEnum,
} from './request-enum'
import { VehicleRequestKey } from './request-vehicle'

export interface VehicleRequestPlateHistoryForms {
  company_name?: string
  metadata?: Record<any, any>
  owner_document: string
  owner_name: string
  plate_state: PlateStateEnum
  plate: string
  postback?: VehicleIntegrationPostbackEnum
  region?: StateEnum
}

export interface VehicleRequestPlateHistoryBody extends VehicleRequestPlateHistoryForms {
  analysis_type: AnalysisTypeEnum
  company_name: string
  status: RequestStatusEnum
  third_party?: VehicleThirdPartyEnum
  user_id: string
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
  synthesis_id?: string
  synthesis_request_id?: string
  from_db?: boolean
}

export interface FinishedVehicleRequestPlateHistory extends VehicleRequestKey, FinishedVehicleRequestPlateHistoryBody {}
