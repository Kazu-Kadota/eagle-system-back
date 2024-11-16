import axios, { AxiosRequestConfig } from 'axios'
import { techmizeV2ConsultarANTTTypeRequest } from 'src/models/techmize/v2/consultar-antt/request-body'
import { techmizeV2ConsultarCNHTypeRequest } from 'src/models/techmize/v2/consultar-cnh/request-body'
import { techmizeV2ConsultarCNHV2TypeRequest } from 'src/models/techmize/v2/consultar-cnh-v2/request-body'
import { techmizeV2ConsultarDadosBasicosPessoaFisicaTypeRequest } from 'src/models/techmize/v2/consultar-dados-basicos-pessoa-fisica/request-body'
import { techmizeV2ConsultarDadosBasicosVeiculoTypeRequest } from 'src/models/techmize/v2/consultar-dados-basicos-veiculo/request-body'
import { techmizeV2ConsultarProcessosTypeRequest } from 'src/models/techmize/v2/consultar-processos/request-body'
import { TechmizeV2CustomRequestErrorResponse } from 'src/models/techmize/v2/custom-request-error'
import { TechmizeV2CustomRequestSuccessResponse } from 'src/models/techmize/v2/custom-request-response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiV2DataSourceCustomRequestHeaders from './headers'

export type TechmizeV2CustomRequestConsultarParamsTypeRequest = typeof techmizeV2ConsultarANTTTypeRequest
  | typeof techmizeV2ConsultarCNHTypeRequest
  | typeof techmizeV2ConsultarCNHV2TypeRequest
  | typeof techmizeV2ConsultarDadosBasicosPessoaFisicaTypeRequest
  | typeof techmizeV2ConsultarDadosBasicosVeiculoTypeRequest
  | typeof techmizeV2ConsultarProcessosTypeRequest

export type TechmizeV2ConsultarParams = {
  cpf: string
  licenseplate?: string
  type_request: TechmizeV2CustomRequestConsultarParamsTypeRequest
}

const TECHMIZE_API_V2_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT = getStringEnv('TECHMIZE_API_V2_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT')

const techmizeV2CustomRequestConsultar = async ({
  cpf,
  licenseplate,
  type_request,
}: TechmizeV2ConsultarParams): Promise<TechmizeV2CustomRequestSuccessResponse | TechmizeV2CustomRequestErrorResponse> => {
  logger.debug({
    message: `TECHMIZE: Consult ${type_request}`,
    service: 'techmize',
    cpf,
    type_request,
    licenseplate,
  })

  const body = {
    cpf,
    licenseplate,
    type_request,
  }

  const options: AxiosRequestConfig = {
    method: 'POST',
    baseURL: TECHMIZE_API_V2_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT,
    headers: techmizeApiV2DataSourceCustomRequestHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TechmizeV2CustomRequestSuccessResponse | TechmizeV2CustomRequestErrorResponse>(options)
    .catch((err) => {
      logger.warn({
        message: `TECHMIZE: Error on request consult ${type_request}`,
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler(`TECHMIZE: Error on request consult ${type_request}`, err.statusCode)
    })

  return data
}

export default techmizeV2CustomRequestConsultar
