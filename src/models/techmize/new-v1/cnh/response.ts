export type TechmizeNewV1CNHResponseDataCNHResult = {
  numero_registro: string
  numero: string
  categoria: string
  data_expiracao: string // YYYY-MM-DD
  renach: string
  primeira_cnh: string // YYYY-MM-DD
  data_emissao: string // YYYY-MM-DD
  nome: string
  nome_mae: string
  nome_pai?: string
  email: string
  telefone: string
  numero_documento: string
  data_nascimento: string // YYYY-MM-DD
}

export type TechmizeNewV1CNHResponseData = {
  cnh: TechmizeNewV1CNHResponseDataCNHResult
}
