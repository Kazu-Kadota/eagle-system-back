import { TechmizeV2ConsultarANTTRequestBody } from './consultar-antt/request-body'
import { TechmizeV2ConsultarCNHRequestBody } from './consultar-cnh/request-body'
import { TechmizeV2ConsultarCNHV2RequestBody } from './consultar-cnh-v2/request-body'
import { TechmizeV2ConsultarDadosBasicosPessoaFisicaRequestBody } from './consultar-dados-basicos-pessoa-fisica/request-body'
import { TechmizeV2ConsultarDadosBasicosVeiculoRequestBody } from './consultar-dados-basicos-veiculo/request-body'
import { TechmizeV2ConsultarProcessosRequestBody } from './consultar-processos/request-body'

export type TechmizeV2CustomRequestGenericErrorResponse = {
  code: 0
  message: string
  data: string | object
}

export type TechmizeV2CustomRequestAuthenticationErrorResponse = {
  code: 0,
  message: 'Erro de autenticação!',
  data: 'Token vazio ou não informado!'
}

export type TechmizeV2CustomRequestForbiddenRequestErrorResponse = {
  code: 0,
  message: 'Combo de Requisição não Cadastrado!',
  data: null
}

export type TechmizeV2CustomRequestRequestErrorResponse = {
  code: 0,
  message: "Quantidade inválida de caracteres do parâmetro 'cpf'!" | "Quantidade inválida de caracteres do parâmetro 'licenseplate'!",
  data: null,
  dataRequest: TechmizeV2ConsultarANTTRequestBody
    | TechmizeV2ConsultarCNHRequestBody
    | TechmizeV2ConsultarCNHV2RequestBody
    | TechmizeV2ConsultarDadosBasicosPessoaFisicaRequestBody
    | TechmizeV2ConsultarDadosBasicosVeiculoRequestBody
    | TechmizeV2ConsultarProcessosRequestBody
}

export type TechmizeV2CustomRequestErrorResponse = TechmizeV2CustomRequestGenericErrorResponse
  | TechmizeV2CustomRequestAuthenticationErrorResponse
  | TechmizeV2CustomRequestForbiddenRequestErrorResponse
  | TechmizeV2CustomRequestRequestErrorResponse
