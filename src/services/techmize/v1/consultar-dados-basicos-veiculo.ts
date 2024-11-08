import axios, { AxiosRequestConfig } from 'axios'
import { TechmizeV1ConsultarDadosBasicosVeiculoRequestBody } from 'src/models/techmize/v1/consultar-dados-basicos-veiculo/request-body'
import { TechmizeV1ConsultarDadosBasicosVeiculoResponse, TechmizeV1ConsultarDadosBasicosVeiculoResponseSuccess } from 'src/models/techmize/v1/consultar-dados-basicos-veiculo/response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiV1DataSourceCustomRequestHeaders from './headers'

export type techmizeV1ConsultarDadosBasicosVeiculoParams = {
  licenseplate: string
  cpf: string
}

const TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT = getStringEnv('TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT')

const techmizeV1ConsultarDadosBasicosVeiculo = async ({
  licenseplate,
  cpf,
}: techmizeV1ConsultarDadosBasicosVeiculoParams): Promise<TechmizeV1ConsultarDadosBasicosVeiculoResponseSuccess> => {
  logger.debug({
    message: 'TECHMIZE: Consult Dados Basicos Veiculos',
    service: 'techmize',
    cpf,
  })

  const body: TechmizeV1ConsultarDadosBasicosVeiculoRequestBody = {
    licenseplate,
    cpf,
    type_request: 'dados_basicos_veiculo',
  }

  const options: AxiosRequestConfig<TechmizeV1ConsultarDadosBasicosVeiculoRequestBody> = {
    method: 'GET',
    baseURL: TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT,
    headers: techmizeApiV1DataSourceCustomRequestHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TechmizeV1ConsultarDadosBasicosVeiculoResponse>(options)
    .catch((err) => {
      logger.warn({
        message: 'TECHMIZE: Error on request consult Dados Basicos Veiculos',
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler('TECHMIZE: Error on consult Dados Basicos Veiculos', err.statusCode)
    })

  if (data.code === 0) {
    logger.warn({
      message: 'TECHMIZE: Error on process consult Dados Basicos Veiculos',
      error: {
        message: data.message,
        data: data.data,
      },
    })

    throw new ErrorHandler('TECHMIZE: Error on process consult Dados Basicos Veiculos', 500)
  }

  return data
}

export default techmizeV1ConsultarDadosBasicosVeiculo
