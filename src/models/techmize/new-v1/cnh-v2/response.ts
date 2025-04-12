export type TechmizeNewV1CNHV2BloqueioCNH = {
  data: string // YYYY-MM-DD
  descricao: string
  dias_penalidade: number
  fim_penalidade: string // YYYY-MM-DD
  inicio_penalidade: string // YYYY-MM-DD
  uf: string
}

export type TechmizeNewV1CNHV2ExameCNH = {
  nome: string
  data: string // YYYY-MM-DD
  local: string
  resultado: string
  validade: string // YYYY-MM-DD
  categoria_pretendida: string
  categoria_permitida: string
  cidade: string
  uf: string
}

export type TechmizeNewV1CNHV2CursoCNH = {
  nome: string
  data_inicio: string // YYYY-MM-DD
  data_fim: string // YYYY-MM-DD
  carga_horaria: number
  categoria: string
  modalidade: string
  validade: string // YYYY-MM-DD
  cidade: string
  uf: string
}

export type TechmizeNewV1CNHV2ExameToxicologico = {
  data_coleta: string // YYYY-MM-DD
  data_uso: string // YYYY-MM-DD
  situacao: string
  validade: string // YYYY-MM-DD
}

export type TechmizeNewV1CNHV2ResponseDataCNHResult = {
  numero_registro: string
  numero: string
  url_foto: string
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
  contagem_debitos: number
  bloqueios: Array<TechmizeNewV1CNHV2BloqueioCNH>
  exames: Array<TechmizeNewV1CNHV2ExameCNH>
  cursos: Array<TechmizeNewV1CNHV2CursoCNH>
  toxicologico: TechmizeNewV1CNHV2ExameToxicologico
}

export type TechmizeNewV1CNHV2ResponseData = {
  cnh_v2: TechmizeNewV1CNHV2ResponseDataCNHResult
}
