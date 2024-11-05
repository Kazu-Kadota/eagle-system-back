import axios, { AxiosRequestConfig } from 'axios'
import { TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody, techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest } from 'src/models/techmize/v1/consultar-dados-basicos-pessoa-fisica/request-body'
import { TechmizeV1ConsultarDadosBasicosPessoaFisicaResponse, TechmizeV1ConsultarDadosBasicosPessoaFisicaSuccessResponse } from 'src/models/techmize/v1/consultar-dados-basicos-pessoa-fisica/response'
import ErrorHandler from 'src/utils/error-handler'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import techmizeApiV1DataSourceCustomRequestHeaders from './headers'

export type techmizeV1ConsultarDadosBasicosPessoaFisicaParams = {
  cpf: string
}

const TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT = getStringEnv('TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT')

const techmizeV1ConsultarDadosBasicosPessoaFisica = async ({
  cpf,
}: techmizeV1ConsultarDadosBasicosPessoaFisicaParams): Promise<TechmizeV1ConsultarDadosBasicosPessoaFisicaSuccessResponse> => {
  logger.debug({
    message: 'TECHMIZE: Consult Dados Basicos Pessoa Fisica',
    service: 'techmize',
    cpf,
  })

  const body: TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody = {
    cpf,
    type_request: techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest,
  }

  const options: AxiosRequestConfig<TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody> = {
    method: 'GET',
    baseURL: TECHMIZE_API_V1_DATA_SOURCE_CUSTOM_REQUEST_ENDPOINT,
    headers: techmizeApiV1DataSourceCustomRequestHeaders(),
    data: body,
  }

  const { data } = await axios
    .request<TechmizeV1ConsultarDadosBasicosPessoaFisicaResponse>(options)
    .catch((err) => {
      logger.warn({
        message: 'TECHMIZE: Error on request consult Dados Basicos Pessoa Fisica',
        error: {
          request: err.request,
          response: {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        },
      })

      throw new ErrorHandler('TECHMIZE: Error on consult Dados Basicos Pessoa Fisica', err.statusCode)
    })

  if (data.code === 0) {
    logger.warn({
      message: 'TECHMIZE: Error on process consult Dados Basicos Pessoa Fisica',
      error: {
        message: data.message,
        data: data.data,
      },
    })

    throw new ErrorHandler('TECHMIZE: Error on process consult Dados Basicos Pessoa Fisica', 500)
  }

  return data
}

export default techmizeV1ConsultarDadosBasicosPessoaFisica
