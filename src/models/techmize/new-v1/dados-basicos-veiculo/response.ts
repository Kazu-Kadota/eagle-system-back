export type TechmizeNewV1DadosBasicosVeiculoDadosBasicosRestricoesVeiculo = {
  restricao_renainf: boolean
  restricao_renajud: boolean
  restricao_rfb: boolean
  roubo_e_furto: boolean
  ocorrencia: string
}

export type TechmizeNewV1DadosBasicosVeiculoDadosBasicosResult = {
  placa: string
  placa_pre_mercosul?: string
  chassi: string
  numero_motor: string
  uf: string
  municipio: string
  renavam: string
  tipo_documento_faturado: string
  documento_faturado: string
  uf_faturado: string
  ano_fabricacao: number
  ano_modelo: number
  situacao: string
  modelo: string
  grupo_veiculo: string
  tipo_veiculo: string
  especie: string
  cor: string
  combustivel: string
  categoria: string
  capacidade: number
  ano_licenciamento: number
  flag_ativo: boolean
  nome_proprietario: string
  documento_proprietario: string
  tipo_documento_proprietario: string
  quantidade_roubo_furto: number
  quantidade_restricoes_admnistrativas: number
  nome_instituicao_alienacao?: string
  documento_instituicao_alienacao?: string
  restricoes: TechmizeNewV1DadosBasicosVeiculoDadosBasicosRestricoesVeiculo
}

export type TechmizeNewV1DadosBasicosVeiculoResponseData = {
  dados_basicos_veiculo: TechmizeNewV1DadosBasicosVeiculoDadosBasicosResult
}
