import { VehicleRequestForms } from './request-vehicle'

export interface VehicleCompaniesContent {
  name: string[]
  updated_at: string
  request_id: string
}

export interface VehicleValidatedContent {
  approved: boolean
  answer_description: string
  updated_at: string
  protocol_id: string
}

export interface VehicleKey {
  vehicle_id: string
  plate: string
}

export interface VehicleBody extends Omit<VehicleRequestForms, 'driver_name' | 'plate'> {
  companies: VehicleCompaniesContent
  validated: VehicleValidatedContent
  black_list?: boolean
  driver_name?: string[]
}

export interface Vehicle extends VehicleKey, VehicleBody {
  updated_at: string
  created_at: string
}
