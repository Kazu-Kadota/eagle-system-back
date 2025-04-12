import axios, { AxiosRequestConfig } from 'axios'
import { TechmizeNewV1ANTTRequestBody, techmizeNewV1ANTTTypeRequest } from 'src/models/techmize/new-v1/antt/request-body'
import { TechmizeNewV1CNHRequestBody, techmizeNewV1CNHTypeRequest } from 'src/models/techmize/new-v1/cnh/request-body'
import { TechmizeNewV1CNHV2RequestBody, techmizeNewV1CNHV2TypeRequest } from 'src/models/techmize/new-v1/cnh-v2/request-body'
import { TechmizeNewV1DadosBasicosPessoaFisicaRequestBody, techmizeNewV1DadosBasicosPessoaFisicaTypeRequest } from 'src/models/techmize/new-v1/dados-basicos-pessoa-fisica/request-body'
import { TechmizeNewV1DadosBasicosVeiculoRequestBody, techmizeNewV1DadosBasicosVeiculoTypeRequest } from 'src/models/techmize/new-v1/dados-basicos-veiculo/request-body'
import { TechmizeNewV1DadosBasicosVeiculoV2RequestBody, techmizeNewV1DadosBasicosVeiculoV2TypeRequest } from 'src/models/techmize/new-v1/dados-basicos-veiculo-v2/request-body'
import { TechmizeNewV1ProcessosRequestBody, techmizeNewV1ProcessosTypeRequest } from 'src/models/techmize/new-v1/processos/request-body'
import { TechmizeNewV1StoreRequestErrorResponse } from 'src/models/techmize/new-v1/store-request-error'
import { TechmizeNewV1StoreRequestSuccessResponse } from 'src/models/techmize/new-v1/store-request-response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiNewV1Headers from './headers'

export type TechmizeNewV1StoreRequestParamsTypeRequest = typeof techmizeNewV1ANTTTypeRequest
  | typeof techmizeNewV1CNHTypeRequest
  | typeof techmizeNewV1CNHV2TypeRequest
  | typeof techmizeNewV1DadosBasicosPessoaFisicaTypeRequest
  | typeof techmizeNewV1DadosBasicosVeiculoTypeRequest
  | typeof techmizeNewV1DadosBasicosVeiculoV2TypeRequest
  | typeof techmizeNewV1ProcessosTypeRequest

export type TechmizeNewV1StoreRequestPersonParams = TechmizeNewV1CNHRequestBody
  | TechmizeNewV1CNHV2RequestBody
  | TechmizeNewV1DadosBasicosPessoaFisicaRequestBody
  | TechmizeNewV1ProcessosRequestBody

export type TechmizeNewV1StoreRequestVehicleParams = TechmizeNewV1ANTTRequestBody
| TechmizeNewV1DadosBasicosVeiculoRequestBody
| TechmizeNewV1DadosBasicosVeiculoV2RequestBody

export type TechmizeNewV1StoreRequestParams = TechmizeNewV1StoreRequestPersonParams | TechmizeNewV1StoreRequestVehicleParams

const TECHMIZE_API_NEW_V1_REQUEST_STORE_REQUEST_ENDPOINT = getStringEnv('TECHMIZE_API_NEW_V1_REQUEST_STORE_REQUEST_ENDPOINT')

const techmizeNewV1StoreRequest = async (body: TechmizeNewV1StoreRequestParams): Promise<TechmizeNewV1StoreRequestSuccessResponse | TechmizeNewV1StoreRequestErrorResponse> => {
  logger.debug({
    message: `TECHMIZE: Request ${body.type_request}`,
    service: 'techmize',
    ...body,
  })

  const options: AxiosRequestConfig = {
    method: 'POST',
    baseURL: TECHMIZE_API_NEW_V1_REQUEST_STORE_REQUEST_ENDPOINT,
    headers: techmizeApiNewV1Headers(),
    data: body,
  }

  const { data } = await axios
    .request<TechmizeNewV1StoreRequestSuccessResponse | TechmizeNewV1StoreRequestErrorResponse>(options)
    .catch((err) => {
      logger.warn({
        message: `TECHMIZE: Error on request ${body.type_request}`,
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler(`TECHMIZE: Error on request ${body.type_request}`, err.statusCode)
    })

  return data
}

export default techmizeNewV1StoreRequest
