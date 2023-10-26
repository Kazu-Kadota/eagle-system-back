export enum UserGroupEnum {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  CLIENT = 'client'
}

export interface RegisterUserRequest {
  user_id?: string
  user_first_name: string
  user_last_name: string
  email: string
  password: string
  user_type: UserGroupEnum
  company_name: string
  api: boolean
}

export interface UserKey {
  user_id: string
}

export interface UserBody {
  user_first_name: string
  user_last_name: string
  email: string
  password: string
  user_type: UserGroupEnum
  company_name: string
  api: boolean
}

export interface User {
  user_id: string
  user_first_name: string
  user_last_name: string
  email: string
  password: string
  user_type: UserGroupEnum
  company_name: string
  api: boolean
  created_at: string
  updated_at: string
}
