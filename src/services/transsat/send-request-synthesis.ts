import axios, { AxiosRequestConfig } from 'axios'

import { SyntheisRequestReceiveMetadata } from 'src/models/dynamo/request-synthesis'
import { TranssatSendRequestSynthesisRequestBody } from 'src/models/dynamo/transsat/send-request-synthesis/request-body'
import { TranssatSendRequestSynthesisResponse } from 'src/models/dynamo/transsat/send-request-synthesis/response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import { transsatGetSynthesisHeaders } from './headers'

export type TranssatSendRequestSynthesisParams = {
  texto: string
  metadata: SyntheisRequestReceiveMetadata
}

const TRANSSAT_API_SYNTHESIS_ENDPOINT = getStringEnv('TRANSSAT_API_SYNTHESIS_ENDPOINT')
const TRANSSAT_API_POSTBACK_URL = getStringEnv('TRANSSAT_API_POSTBACK_URL')

const transsatSendRequestSynthesis = async ({
  texto,
  metadata,
}: TranssatSendRequestSynthesisParams): Promise<TranssatSendRequestSynthesisResponse> => {
  logger.debug({
    message: 'TRANSSAT: Send request of text',
    service: 'transsat',
  })

  const body: TranssatSendRequestSynthesisRequestBody = {
    texto,
    url: TRANSSAT_API_POSTBACK_URL,
    metadata,
  }

  const options: AxiosRequestConfig<TranssatSendRequestSynthesisRequestBody> = {
    method: 'POST',
    baseURL: TRANSSAT_API_SYNTHESIS_ENDPOINT,
    headers: await transsatGetSynthesisHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TranssatSendRequestSynthesisResponse>(options)
    .catch((err) => {
      logger.warn({
        message: 'TRANSSAT: Error on send request of text',
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler('TRANSSAT: Error on send request of text', err.statusCode)
    })

  return data
}

export default transsatSendRequestSynthesis
