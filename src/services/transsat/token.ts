import axios, { AxiosRequestConfig } from 'axios'
import { LRUCache } from 'lru-cache'
import { TranssatGetTokenResponse } from 'src/models/dynamo/transsat/get-token/response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import url from 'url'

import { transsatGetTokenHeaders } from './headers'

const cache_options = {
  ttl: 3 * 60 * 59, // 3 hours: 59 seconds * 60 minutes * 3 hours
  ttlAutopurge: true,
}

const token_cache = new LRUCache(cache_options)

const TRANSSAT_API_TOKEN_ENDPOINT = getStringEnv('TRANSSAT_API_TOKEN_ENDPOINT')
const TRANSSAT_API_GET_TOKEN_CLIENT_ID = getStringEnv('TRANSSAT_API_GET_TOKEN_CLIENT_ID')
const TRANSSAT_API_GET_TOKEN_CLIENT_SECRET = getStringEnv('TRANSSAT_API_GET_TOKEN_CLIENT_SECRET')
const TRANSSAT_API_GET_TOKEN_GRANT_TYPE = getStringEnv('TRANSSAT_API_GET_TOKEN_GRANT_TYPE')
const TRANSSAT_API_GET_TOKEN_USERNAME = getStringEnv('TRANSSAT_API_GET_TOKEN_USERNAME')
const TRANSSAT_API_GET_TOKEN_PASSWORD = getStringEnv('TRANSSAT_API_GET_TOKEN_PASSWORD')

const transsatToken = async () => {
  const now = new Date()

  if (!token_cache.has('token')) {
    logger.debug({
      message: 'TRANSSAT: Getting token',
      service: 'transsat',
    })

    const params = new url.URLSearchParams({
      client_id: TRANSSAT_API_GET_TOKEN_CLIENT_ID,
      client_secret: TRANSSAT_API_GET_TOKEN_CLIENT_SECRET,
      grant_type: TRANSSAT_API_GET_TOKEN_GRANT_TYPE,
      username: TRANSSAT_API_GET_TOKEN_USERNAME,
      password: TRANSSAT_API_GET_TOKEN_PASSWORD,
    })

    const options: AxiosRequestConfig = {
      method: 'post',
      baseURL: TRANSSAT_API_TOKEN_ENDPOINT,
      headers: transsatGetTokenHeaders(),
      data: params.toString(),
    }

    const result = await axios
      .request<TranssatGetTokenResponse>(options)
      .catch((err) => {
        logger.warn({
          message: 'TRANSSAT: Error on get token',
          error: err,
        })

        throw new ErrorHandler('TRANSSAT: Error on get token', err.statusCode)
      })

    token_cache.set('token', {
      ...result.data,
      created_at: now,
    })

    return result.data.access_token
  }

  const token = token_cache.get('token') as TranssatGetTokenResponse & { created_at: Date }

  return token.access_token
}

export default transsatToken
