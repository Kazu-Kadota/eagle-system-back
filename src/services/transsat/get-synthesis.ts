import axios, { AxiosRequestConfig } from 'axios'

import { TranssatGetSynthesisRequestBody } from 'src/models/dynamo/transsat/get-synthesis/request-body'
import { TranssatGetSynthesisResponse } from 'src/models/dynamo/transsat/get-synthesis/response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import { transsatGetSynthesisHeaders } from './headers'

export type TranssatGetSynthesisParams = TranssatGetSynthesisRequestBody

const TRANSSAT_API_SYNTHESIS_ENDPOINT = getStringEnv('TRANSSAT_API_SYNTHESIS_ENDPOINT')

const transsatGetSynthesis = async ({
  texto,
}: TranssatGetSynthesisParams): Promise<TranssatGetSynthesisResponse> => {
  logger.debug({
    message: 'TRANSSAT: Get response of text',
    service: 'transsat',
  })

  const body: TranssatGetSynthesisParams = {
    texto,
  }

  const options: AxiosRequestConfig<TranssatGetSynthesisParams> = {
    method: 'GET',
    baseURL: TRANSSAT_API_SYNTHESIS_ENDPOINT,
    headers: transsatGetSynthesisHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TranssatGetSynthesisResponse>(options)
    .catch((err) => {
      logger.warn({
        message: 'TRANSSAT: Error on request get response',
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler('TRANSSAT: Error on request get response', err.statusCode)
    })

  return data
}

export default transsatGetSynthesis
