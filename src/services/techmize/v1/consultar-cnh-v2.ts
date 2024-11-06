import axios, { AxiosRequestConfig } from 'axios'
import { TechmizeV1ConsultarCNHV2RequestBody, techmizeV1ConsultarCNHV2TypeRequest } from 'src/models/techmize/v1/consultar-cnh-v2/request-body'
import { TechmizeV1ConsultarCNHV2Response, TechmizeV1ConsultarCNHV2ResponseSuccess } from 'src/models/techmize/v1/consultar-cnh-v2/response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiV1DataSourceCustomRequestHeaders from './headers'

export type TechmizeV1ConsultarCNHV2Params = {
  cpf: string
}

const TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT = getStringEnv('TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT')

const techmizeV1ConsultarCNHV2 = async ({
  cpf,
}: TechmizeV1ConsultarCNHV2Params): Promise<TechmizeV1ConsultarCNHV2ResponseSuccess> => {
  logger.debug({
    message: 'TECHMIZE: Consult CNH V2',
    service: 'techmize',
    cpf,
  })

  const body: TechmizeV1ConsultarCNHV2RequestBody = {
    cpf,
    type_request: techmizeV1ConsultarCNHV2TypeRequest,
  }

  const options: AxiosRequestConfig<TechmizeV1ConsultarCNHV2RequestBody> = {
    method: 'GET',
    baseURL: TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT,
    headers: techmizeApiV1DataSourceCustomRequestHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TechmizeV1ConsultarCNHV2Response>(options)
    .catch((err) => {
      logger.warn({
        message: 'TECHMIZE: Error on request consult CNH V2',
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler('TECHMIZE: Error on consult CNH V2', err.statusCode)
    })

  if (data.code === 0) {
    logger.warn({
      message: 'TECHMIZE: Error on process consult CNH V2',
      error: {
        message: data.message,
        data: data.data,
      },
    })

    throw new ErrorHandler('TECHMIZE: Error on process consult CNH V2', 500)
  }

  return data
}

export default techmizeV1ConsultarCNHV2
