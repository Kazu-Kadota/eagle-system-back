import { TechmizeV1AuthenticationErrorResponse, TechmizeV1GenericErrorResponse, TechmizeV1SuccessErrorResponse } from '../error'

export type TechmizeV1ConsultarCNHResponseTiposDebito = {
  guid: string
  campos_obrigatorios: any[]
}

export type TechmizeV1ConsultarCNHResponseDataCNHDetails = {
  numero_registro: string
  categoria: string
  data_emissao: string
  data_expiracao: string
  data_nascimento: string
  nome: string
  nome_mae: string
  nome_pai: string
  numero: string
  numero_documento: string
  primeira_cnh: string
  renach: string
  tipos_debito: TechmizeV1ConsultarCNHResponseTiposDebito[]
}

export type TechmizeV1ConsultarCNHResponseDataCNH = {
  cnh: TechmizeV1ConsultarCNHResponseDataCNHDetails
}

export type TechmizeV1ConsultarCNHResponseData = {
  cnh: TechmizeV1ConsultarCNHResponseDataCNH | TechmizeV1SuccessErrorResponse
}

export type TechmizeV1ConsultarCNHResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV1ConsultarCNHResponseData
}

export type TechmizeV1ConsultarCNHResponse = TechmizeV1GenericErrorResponse | TechmizeV1AuthenticationErrorResponse | TechmizeV1ConsultarCNHResponseSuccess
