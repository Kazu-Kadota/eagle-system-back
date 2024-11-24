export type TechmizeV2ConsultarCNHResponseTiposDebito = {
  guid: string
  campos_obrigatorios: any[]
}

export type TechmizeV2ConsultarCNHResponseDataCNHDetails = {
  numero_registro: string
  categoria: string
  contagem_debitos: number | null
  data_emissao: string
  data_expiracao: string
  data_nascimento: string
  email: string | null
  guid: string | null
  nome: string
  nome_mae: string
  nome_pai: string
  numero: string
  numero_documento: string
  primeira_cnh: string
  renach: string
  telefone: string | null
  tipos_debito: TechmizeV2ConsultarCNHResponseTiposDebito[]
}

export type TechmizeV2ConsultarCNHResponseDataCNH = {
  cnh: TechmizeV2ConsultarCNHResponseDataCNHDetails
}

export type TechmizeV2ConsultarCNHResponseData = {
  cnh: TechmizeV2ConsultarCNHResponseDataCNH[]
}

export type TechmizeV2ConsultarCNHResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV2ConsultarCNHResponseData
  status_request: string
}
