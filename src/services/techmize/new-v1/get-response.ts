import axios, { AxiosRequestConfig } from 'axios'

import { TechmizeNewV1GetResponseSuccessResponse } from 'src/models/techmize/new-v1/get-response'
import { TechmizeNewV1GetResponseErrorResponse } from 'src/models/techmize/new-v1/get-response-error'
import { TechmizeNewV1GetResponseRequestBody } from 'src/models/techmize/new-v1/get-response-request-body'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiNewV1Headers from './headers'

export type TechmizeNewV1GetResponseParams = TechmizeNewV1GetResponseRequestBody

export type TechmizeNewV1GetResponseResponse = TechmizeNewV1GetResponseSuccessResponse | TechmizeNewV1GetResponseErrorResponse

const TECHMIZE_API_NEW_V1_REQUEST_GET_RESPONSE_ENDPOINT = getStringEnv('TECHMIZE_API_NEW_V1_REQUEST_GET_RESPONSE_ENDPOINT')

const techmizeNewV1GetResponse = async ({
  protocol,
}: TechmizeNewV1GetResponseParams): Promise<TechmizeNewV1GetResponseResponse> => {
  logger.debug({
    message: `TECHMIZE: Get response of protocol ${protocol}`,
    service: 'techmize',
    protocol,
  })

  const body: TechmizeNewV1GetResponseParams = {
    protocol,
  }

  const options: AxiosRequestConfig<TechmizeNewV1GetResponseParams> = {
    method: 'GET',
    baseURL: TECHMIZE_API_NEW_V1_REQUEST_GET_RESPONSE_ENDPOINT,
    headers: techmizeApiNewV1Headers(),
    data: body,
    timeout: 30000,
    timeoutErrorMessage: 'TECHMIZE: Request time exceed 20 seconds',
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  }

  const { data } = await axios
    .request<TechmizeNewV1GetResponseResponse>(options)
    .catch((err) => {
      logger.warn({
        message: `TECHMIZE: Error on request get response of protocol ${protocol}`,
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler(`TECHMIZE: Error on request get response of protocol ${protocol}`, err.statusCode)
    })

  return data
}

export default techmizeNewV1GetResponse
