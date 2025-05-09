import { Timestamp } from './timestamp'

export enum CompanyTypeEnum {
  CLIENT = 'client',
  FONT = 'font',
}

export type CompanyKey = {
  company_id: string
}

export type CompanyBody = {
  cnpj: string
  name: string
  type: CompanyTypeEnum
}

export type Company = CompanyKey & CompanyBody & Timestamp & {}
