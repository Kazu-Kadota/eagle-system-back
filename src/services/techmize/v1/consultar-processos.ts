import axios, { AxiosRequestConfig } from 'axios'
import { TechmizeV1ConsultarProcessosRequestBody, techmizeV1ConsultarProcessosTypeRequest } from 'src/models/techmize/v1/consultar-processos/request-body'
import { TechmizeV1ConsultarProcessosResponse } from 'src/models/techmize/v1/consultar-processos/response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiV1DataSourceCustomRequestHeaders from './headers'

export type techmizeV1ConsultarProcessosParams = {
  cpf: string
}

const TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT = getStringEnv('TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT')

const techmizeV1ConsultarProcessos = async ({
  cpf,
}: techmizeV1ConsultarProcessosParams): Promise<TechmizeV1ConsultarProcessosResponse> => {
  logger.debug({
    message: 'TECHMIZE: Consult Processos',
    service: 'techmize',
    cpf,
  })

  const body: TechmizeV1ConsultarProcessosRequestBody = {
    cpf,
    type_request: techmizeV1ConsultarProcessosTypeRequest,
  }

  const options: AxiosRequestConfig<TechmizeV1ConsultarProcessosRequestBody> = {
    method: 'GET',
    baseURL: TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT,
    headers: techmizeApiV1DataSourceCustomRequestHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TechmizeV1ConsultarProcessosResponse>(options)
    .catch((err) => {
      logger.warn({
        message: 'TECHMIZE: Error on request consult processos',
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler('TECHMIZE: Error on consult processos', err.statusCode)
    })

  if (data.code === 0) {
    logger.warn({
      message: 'TECHMIZE: Error on process consult Processos',
      error: {
        message: data.message,
        data: data.data,
      },
    })

    throw new ErrorHandler('TECHMIZE: Error on process consult Processos', 500)
  }

  return data
}

export default techmizeV1ConsultarProcessos
