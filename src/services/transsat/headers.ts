import { RawAxiosRequestHeaders } from 'axios'

import transsatToken from './token'

export const transsatGetTokenHeaders = (): RawAxiosRequestHeaders => ({
  'Content-Type': 'application/x-www-form-urlencoded',
})

export const transsatGetSynthesisHeaders = async (): Promise<RawAxiosRequestHeaders> => ({
  Authorization: 'Bearer ' + await transsatToken(),
  'Content-Type': 'application/json',
  empresa_id: 8,
  cliente_id: 1,
})
