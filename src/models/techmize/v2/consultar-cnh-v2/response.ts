export type TechmizeV2ConsultarCNHV2ResponseDebitType = {
  guid: string
  campos_obrigatorios: any[] // Modify this based on the actual structure of campos_obrigatorios
}

export type TechmizeV2ConsultarCNHV2ResponseToxicology = {
  situacao: string
}

export type TechmizeV2ConsultarCNHV2ResponseExam = {
  nome: string
  data: string
  validade?: string
  categoria_solicitada: string
  categoria_permitida: string
  cidade: string
  uf: string
}

export type TechmizeV2ConsultarCNHV2ResponseCourse = {
  nome: string
  data_inicio: string
  data_fim: string
  carga_horaria: string
  categoria: string
  modalidade: string
  cidade: string
  uf: string
}

export type TechmizeV2ConsultarCNHV2ResponseDataCNHDetails = {
  numero_registro: string
  categoria: string
  data_emissao: string
  data_expiracao: string
  data_nascimento: string
  guid: string
  nome: string
  nome_mae: string
  nome_pai: string
  numero: string
  numero_documento: string
  primeira_cnh: string
  renach: string
  tipos_debito: TechmizeV2ConsultarCNHV2ResponseDebitType[]
  toxicologico: TechmizeV2ConsultarCNHV2ResponseToxicology
  bloqueios: any[] // Modify this based on the actual structure of bloqueios
  exames: TechmizeV2ConsultarCNHV2ResponseExam[]
  cursos: TechmizeV2ConsultarCNHV2ResponseCourse[]
}

export type TechmizeV2ConsultarCNHV2ResponseDataCNH = {
  cnh_v2: any
}

export type TechmizeV2ConsultarCNHV2ResponseData = {
  cnh_v2: TechmizeV2ConsultarCNHV2ResponseDataCNH[]
}

export type TechmizeV2ConsultarCNHV2ResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV2ConsultarCNHV2ResponseData
  status_request: string
}
