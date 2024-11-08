import axios, { AxiosRequestConfig } from 'axios'
import { TechmizeV1ConsultarANTTRequestBody } from 'src/models/techmize/v1/consultar-antt/request-body'
import { TechmizeV1ConsultarANTTResponse, TechmizeV1ConsultarANTTResponseSuccess } from 'src/models/techmize/v1/consultar-antt/response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiV1DataSourceCustomRequestHeaders from './headers'

export type techmizeV1ConsultarANTTParams = {
  licenseplate: string
  cpf: string
}

const TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT = getStringEnv('TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT')

const techmizeV1ConsultarANTT = async ({
  licenseplate,
  cpf,
}: techmizeV1ConsultarANTTParams): Promise<TechmizeV1ConsultarANTTResponseSuccess> => {
  logger.debug({
    message: 'TECHMIZE: Consult ANTT',
    service: 'techmize',
    cpf,
  })

  const body: TechmizeV1ConsultarANTTRequestBody = {
    licenseplate,
    cpf,
    type_request: 'antt',
  }

  const options: AxiosRequestConfig<TechmizeV1ConsultarANTTRequestBody> = {
    method: 'GET',
    baseURL: TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT,
    headers: techmizeApiV1DataSourceCustomRequestHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TechmizeV1ConsultarANTTResponse>(options)
    .catch((err) => {
      logger.warn({
        message: 'TECHMIZE: Error on request consult ANTT',
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler('TECHMIZE: Error on consult ANTT', err.statusCode)
    })

  if (data.code === 0) {
    logger.warn({
      message: 'TECHMIZE: Error on process consult ANTT',
      error: {
        message: data.message,
        data: data.data,
      },
    })

    throw new ErrorHandler('TECHMIZE: Error on process consult ANTT', 500)
  }

  return data
}

export default techmizeV1ConsultarANTT
