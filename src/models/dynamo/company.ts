export enum CompanyTypeEnum {
  CLIENT = 'client',
  FONT = 'font',
}

export interface CompanyKey {
  company_id: string
}

export interface CompanyBody {
  cnpj: string
  name: string
  type: CompanyTypeEnum
}

export interface Company extends CompanyKey, CompanyBody {
  created_at: string
  updated_at: string
}
