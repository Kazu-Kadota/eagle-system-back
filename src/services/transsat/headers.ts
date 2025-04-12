import { RawAxiosRequestHeaders } from 'axios'

import getStringEnv from 'src/utils/get-string-env'

import transsatToken from './token'

const TRANSSAT_API_GET_TOKEN_CLIENT_ID = getStringEnv('TRANSSAT_API_GET_TOKEN_CLIENT_ID')
const TRANSSAT_API_GET_TOKEN_CLIENT_SECRET = getStringEnv('TRANSSAT_API_GET_TOKEN_CLIENT_SECRET')
const TRANSSAT_API_GET_TOKEN_GRANT_TYPE = getStringEnv('TRANSSAT_API_GET_TOKEN_GRANT_TYPE')
const TRANSSAT_API_GET_TOKEN_USERNAME = getStringEnv('TRANSSAT_API_GET_TOKEN_USERNAME')
const TRANSSAT_API_GET_TOKEN_PASSWORD = getStringEnv('TRANSSAT_API_GET_TOKEN_PASSWORD')

export const transsatGetTokenHeaders = (): RawAxiosRequestHeaders => ({
  client_id: TRANSSAT_API_GET_TOKEN_CLIENT_ID,
  client_secret: TRANSSAT_API_GET_TOKEN_CLIENT_SECRET,
  grant_type: TRANSSAT_API_GET_TOKEN_GRANT_TYPE,
  user_name: TRANSSAT_API_GET_TOKEN_USERNAME,
  password: TRANSSAT_API_GET_TOKEN_PASSWORD,
})

export const transsatGetSynthesisHeaders = (): RawAxiosRequestHeaders => ({
  Authorization: 'Bearer ' + transsatToken(),
  'Content-Type': 'application/json',
})
