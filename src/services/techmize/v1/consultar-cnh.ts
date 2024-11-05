import axios, { AxiosRequestConfig } from 'axios'
import { TechmizeV1ConsultarCNHRequestBody, techmizeV1ConsultarCNHTypeRequest } from 'src/models/techmize/v1/consultar-cnh/request-body'
import { TechmizeV1ConsultarCNHResponse } from 'src/models/techmize/v1/consultar-cnh/response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiV1DataSourceCustomRequestHeaders from './headers'

export type techmizeV1ConsultarCNHParams = {
  cpf: string
}

const TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT = getStringEnv('TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT')

const techmizeV1ConsultarCNH = async ({
  cpf,
}: techmizeV1ConsultarCNHParams): Promise<TechmizeV1ConsultarCNHResponse> => {
  logger.debug({
    message: 'TECHMIZE: Consult CNH',
    service: 'techmize',
    cpf,
  })

  const body: TechmizeV1ConsultarCNHRequestBody = {
    cpf,
    type_request: techmizeV1ConsultarCNHTypeRequest,
  }

  const options: AxiosRequestConfig<TechmizeV1ConsultarCNHRequestBody> = {
    method: 'GET',
    baseURL: TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT,
    headers: techmizeApiV1DataSourceCustomRequestHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TechmizeV1ConsultarCNHResponse>(options)
    .catch((err) => {
      logger.warn({
        message: 'TECHMIZE: Error on request consult CNH',
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler('TECHMIZE: Error on consult CNH', err.statusCode)
    })

  if (data.code === 0) {
    logger.warn({
      message: 'TECHMIZE: Error on process consult CNH',
      error: {
        message: data.message,
        data: data.data,
      },
    })

    throw new ErrorHandler('TECHMIZE: Error on process consult CNH', 500)
  }

  return data
}

export default techmizeV1ConsultarCNH
