import { TechmizeNewV1ANTTRequestBody } from './antt/request-body'
import { TechmizeNewV1CNHRequestBody } from './cnh/request-body'
import { TechmizeNewV1CNHV2RequestBody } from './cnh-v2/request-body'
import { TechmizeNewV1DadosBasicosPessoaFisicaRequestBody } from './dados-basicos-pessoa-fisica/request-body'
import { TechmizeNewV1DadosBasicosVeiculoRequestBody } from './dados-basicos-veiculo/request-body'
import { TechmizeNewV1ProcessosRequestBody } from './processos/request-body'

export type TechmizeNewV1StoreRequestGenericErrorResponse = {
  code: 0
  message: string
  data: string | object
}

export type TechmizeNewV1StoreRequestAuthenticationErrorResponse = {
  code: 0,
  message: 'Erro de autenticação!',
  data: 'Token inválido!'
}

export type TechmizeNewV1StoreRequestForbiddenRequestErrorResponse = {
  code: 0,
  message: 'Combo de Requisição não Cadastrado!',
  data: null
}

export type TechmizeNewV1StoreRequestValidationErrorResponse = {
  code: 0,
  message: 'Erro de validação!',
  data: 'Valor inválido para o campo side. Valores permitidos: A-B, AB'
}

export type TechmizeNewV1StoreRequestRequestErrorResponse = {
  code: 0,
  message: "Quantidade inválida de caracteres do parâmetro 'cpf'!" | "Quantidade inválida de caracteres do parâmetro 'plate'!",
  data: null,
  dataRequest: TechmizeNewV1ANTTRequestBody
    | TechmizeNewV1CNHRequestBody
    | TechmizeNewV1CNHV2RequestBody
    | TechmizeNewV1DadosBasicosPessoaFisicaRequestBody
    | TechmizeNewV1DadosBasicosVeiculoRequestBody
    | TechmizeNewV1ProcessosRequestBody
}

export type TechmizeNewV1StoreRequestErrorResponse = TechmizeNewV1StoreRequestGenericErrorResponse
  | TechmizeNewV1StoreRequestAuthenticationErrorResponse
  | TechmizeNewV1StoreRequestForbiddenRequestErrorResponse
  | TechmizeNewV1StoreRequestValidationErrorResponse
  | TechmizeNewV1StoreRequestRequestErrorResponse
