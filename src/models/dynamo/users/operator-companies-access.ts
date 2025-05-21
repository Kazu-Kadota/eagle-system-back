import { Timestamp } from '../timestamp'

export type OperatorCompaniesAccessKey = {
  user_id: string
}

export type OperatorCompaniesAccessBody = {
  companies: Array<string>
}

export type OperatorCompaniesAccess = OperatorCompaniesAccessKey & OperatorCompaniesAccessBody & Timestamp & {}

export type OperatorCompaniesAccessRegisterParams = OperatorCompaniesAccessKey & OperatorCompaniesAccessBody & {}
