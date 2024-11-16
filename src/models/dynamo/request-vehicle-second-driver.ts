import {
  AnalysisTypeEnum,
  PlateStateEnum,
  RequestStatusEnum,
  VehicleAnalysisTypeEnum,
} from './request-enum'
import { VehicleRequestKey } from './request-vehicle'

export interface VehicleRequestSecondDriverForms {
  company_name?: string
  owner_document: string
  owner_name: string
  plate_state: PlateStateEnum
  plate: string
}

export interface VehicleRequestSecondDriverBody extends VehicleRequestSecondDriverForms {
  analysis_type: AnalysisTypeEnum
  company_name: string
  status: RequestStatusEnum
  third_party?: any
  user_id: string
  vehicle_analysis_type: VehicleAnalysisTypeEnum.VEHICLE_SECOND_DRIVER
}

export interface VehicleSecondDriverRequest extends VehicleRequestKey, VehicleRequestSecondDriverBody {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
  from_db?: boolean
}

export interface FinishedVehicleRequestSecondDriverBody extends VehicleRequestSecondDriverBody {
  created_at: string
  updated_at: string
  finished_at?: string
  analysis_info?: string
  analysis_result?: string
  from_db?: boolean
}

export interface FinishedVehicleRequestSecondDriver extends VehicleRequestKey, FinishedVehicleRequestSecondDriverBody {}
