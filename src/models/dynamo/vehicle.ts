import { VehicleAnalysisTypeEnum } from './request-enum'
import { VehicleRequestForms } from './request-vehicle'

export type VehicleCompaniesContent = {
  name: string[]
  updated_at: string
  request_id: string
}

export type VehicleValidatedContent = {
  approved: boolean
  answer_description: string
  updated_at: string
  protocol_id: string
}

export type VehicleKey = {
  vehicle_id: string
  plate: string
}

export type VehicleBody = Omit<VehicleRequestForms, 'driver_name' | 'plate'> & {
  companies: Partial<Record<VehicleAnalysisTypeEnum, VehicleCompaniesContent>>
  validated: Partial<Record<VehicleAnalysisTypeEnum, VehicleValidatedContent>>
  black_list?: boolean
  driver_name?: string[]
}

export type Vehicle = VehicleKey & VehicleBody & {
  updated_at: string
  created_at: string
}
