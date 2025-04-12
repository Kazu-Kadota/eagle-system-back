export type TechmizeNewV1ProcessosResponseProcessoParteProcesso = {
  documento: string
  parte_ativa: boolean
  nome: string
  polaridade: string
  detalhes_partes: {
    tipo_especifico: string
  }
  data_ultima_captura: string // YYYY-MM-DD HH:MM:SS
}

export type TechmizeNewV1ProcessosResponseProcessoAtualizacaoProcesso = {
  conteudo: string
  data_publicacao: string // YYYY-MM-DD HH:MM:SS
  data_captura: string // YYYY-MM-DD HH:MM:SS
}

export type TechmizeNewV1ProcessosResponseProcessoPeticaoProcesso = {
  tipo: string
  autor: string
  data_criacao: string // YYYY-MM-DD HH:MM:SS
  data_juntada: string // YYYY-MM-DD HH:MM:SS
}

export type TechmizeNewV1ProcessosResponseProcessoDecisaoProcesso = {
  conteudo_decisao: string
  data_decisao: string // YYYY-MM-DD HH:MM:SS
}

export type TechmizeNewV1ProcessosResponseProcesso = {
  numero: string
  tipo: string
  assunto_principal: string
  nome_tribunal: string
  nivel_tribunal: number
  tipo_tribunal: string
  distrito_tribunal: string
  juiz: string
  vara_tribunal: string
  estado: string
  status: string
  servico_processo: string
  processos_relacionados: Array<string>
  assunto_cnj_inferido: string
  numero_cnj_inferido: string
  artigo: string
  dispositivo_legal: string
  glossario: string
  tipo_processo_cnj_inferido: string
  numero_tipo_processo_cnj_inferido: string
  assunto_cnj_amplo_inferido: string
  numero_assunto_cnj_amplo_inferido: string
  outros_assuntos: Array<string>
  numero_volumes: number
  numero_paginas: number
  valor: number
  data_transito_em_julgado: string
  data_arquivamento: string
  data_redistribuicao: string
  data_publicacao: string
  data_notificacao: string
  data_ultima_movimentacao: string
  data_captura: string
  ultima_atualizacao: string
  numero_partes: number
  numero_atualizacoes: number
  idade_processo: number
  media_atualizacoes_por_mes: number
  motivo_dados_ocultos?: string
  partes: Array<TechmizeNewV1ProcessosResponseProcessoParteProcesso>
  atualizacoes: Array<TechmizeNewV1ProcessosResponseProcessoAtualizacaoProcesso>
  peticoes: Array<TechmizeNewV1ProcessosResponseProcessoPeticaoProcesso>
  decisoes: Array<TechmizeNewV1ProcessosResponseProcessoDecisaoProcesso>
}

export type TechmizeNewV1ProcessosResponseDataDetails = {
  processos: Array<TechmizeNewV1ProcessosResponseProcesso>
  total_processos: number
  total_como_autor: number
  total_como_reu: number
  total_como_outro: number
  data_primeiro_processo: string
  data_ultimo_processo: string
  ultimos_30_dias: number
  ultimos_90_dias: number
  ultimos_180_dias: number
  ultimos_365_dias: number
}

export type TechmizeNewV1ProcessosResponseData = {
  processos_judiciais_administrativos: TechmizeNewV1ProcessosResponseDataDetails
}
