import axios, { AxiosRequestConfig } from 'axios'

import { TechmizeV2ConsultarANTTResponseSuccess } from 'src/models/techmize/v2/consultar-antt/response'
import { TechmizeV2ConsultarCNHResponseSuccess } from 'src/models/techmize/v2/consultar-cnh/response'
import { TechmizeV2ConsultarCNHV2ResponseSuccess } from 'src/models/techmize/v2/consultar-cnh-v2/response'
import { TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseSuccess } from 'src/models/techmize/v2/consultar-dados-basicos-pessoa-fisica/response'
import { TechmizeV2ConsultarDadosBasicosVeiculoResponseSuccess } from 'src/models/techmize/v2/consultar-dados-basicos-veiculo/response'
import { TechmizeV2ConsultarProcessosResponseSuccess } from 'src/models/techmize/v2/consultar-processos/response'
import { TechmizeV2GetRequestErrorResponse } from 'src/models/techmize/v2/get-response-error'
import { TechmizeV2GetResponseRequestBody } from 'src/models/techmize/v2/get-response-request-body'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiV2DataSourceCustomRequestHeaders from './headers'

export type TechmizeV2GetResponseResponse = TechmizeV2ConsultarANTTResponseSuccess
  | TechmizeV2ConsultarCNHResponseSuccess
  | TechmizeV2ConsultarCNHV2ResponseSuccess
  | TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseSuccess
  | TechmizeV2ConsultarDadosBasicosVeiculoResponseSuccess
  | TechmizeV2ConsultarProcessosResponseSuccess

export type TechmizeV2ConsultarParams = TechmizeV2GetResponseRequestBody

const TECHMIZE_API_V2_DATA_SOURCE_GET_RESPONSE_ENDPOINT = getStringEnv('TECHMIZE_API_V2_DATA_SOURCE_GET_RESPONSE_ENDPOINT')

const techmizeV2GetResponse = async ({
  protocol,
}: TechmizeV2ConsultarParams): Promise<TechmizeV2GetResponseResponse | TechmizeV2GetRequestErrorResponse> => {
  logger.debug({
    message: `TECHMIZE: Get response of protocol ${protocol}`,
    service: 'techmize',
    protocol,
  })

  const body: TechmizeV2ConsultarParams = {
    protocol,
  }

  const options: AxiosRequestConfig<TechmizeV2ConsultarParams> = {
    method: 'POST',
    baseURL: TECHMIZE_API_V2_DATA_SOURCE_GET_RESPONSE_ENDPOINT,
    headers: techmizeApiV2DataSourceCustomRequestHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TechmizeV2GetResponseResponse | TechmizeV2GetRequestErrorResponse>(options)
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

export default techmizeV2GetResponse
