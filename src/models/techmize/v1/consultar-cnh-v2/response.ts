import { TechmizeV1AuthenticationErrorResponse, TechmizeV1GenericErrorResponse, TechmizeV1SuccessErrorResponse } from '../error'

export type TechmizeV1ConsultarCNHV2ResponseDebitType = {
  guid: string
  campos_obrigatorios: any[] // Modify this based on the actual structure of campos_obrigatorios
}

export type TechmizeV1ConsultarCNHV2ResponseToxicology = {
  situacao: string
}

export type TechmizeV1ConsultarCNHV2ResponseExam = {
  nome: string
  data: string
  validade?: string
  categoria_solicitada: string
  categoria_permitida: string
  cidade: string
  uf: string
}

export type TechmizeV1ConsultarCNHV2ResponseCourse = {
  nome: string
  data_inicio: string
  data_fim: string
  carga_horaria: string
  categoria: string
  modalidade: string
  cidade: string
  uf: string
}

export type TechmizeV1ConsultarCNHV2ResponseDataCNHDetails = {
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
  tipos_debito: TechmizeV1ConsultarCNHV2ResponseDebitType[]
  toxicologico: TechmizeV1ConsultarCNHV2ResponseToxicology
  bloqueios: any[] // Modify this based on the actual structure of bloqueios
  exames: TechmizeV1ConsultarCNHV2ResponseExam[]
  cursos: TechmizeV1ConsultarCNHV2ResponseCourse[]
}

export type TechmizeV1ConsultarCNHV2ResponseDataCNH = {
  cnh_v2: TechmizeV1ConsultarCNHV2ResponseDataCNHDetails
}

export type TechmizeV1ConsultarCNHV2ResponseData = {
  cnh_v2: TechmizeV1ConsultarCNHV2ResponseDataCNH | TechmizeV1SuccessErrorResponse
}

export type TechmizeV1ConsultarCNHV2ResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV1ConsultarCNHV2ResponseData
}

export type TechmizeV1ConsultarCNHV2Response = TechmizeV1GenericErrorResponse | TechmizeV1AuthenticationErrorResponse | TechmizeV1ConsultarCNHV2ResponseSuccess
