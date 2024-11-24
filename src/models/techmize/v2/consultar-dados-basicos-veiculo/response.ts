export type TechmizeV2ConsultarDadosBasicosVeiculoDadosBasicos = {
  ano_fabricacao: number
  ano_licenciamento: number
  ano_modelo: number
  capacidade: number
  categoria: string
  chassi: string
  combustivel: string
  cor: string
  debit_type_guid: string
  documento_faturado: any | null
  documento_instituicao_alienacao: any | null
  documento_proprietario: string
  especie: string
  flag_ativo: any | null
  grupo_veiculo: any | null
  modelo: string
  municipio: string
  nome_instituicao_alienacao: any | null
  nome_proprietario: string
  numero_motor: string
  placa_pre_mercosul: any | null
  placa: string
  quantidade_restricoes_admnistrativas: any | null
  quantidade_roubo_furto: any | null
  renavam: string
  restricoes: any[]
  situacao: string
  tipo_documento_faturado: any | null
  tipo_documento_proprietario: string
  tipo_veiculo: string
  uf_faturado: any | null
  uf: string
}

export type TechmizeV2ConsultarDadosBasicosVeiculoDadosBasicosVeiculo = {
  dados_basicos: TechmizeV2ConsultarDadosBasicosVeiculoDadosBasicos
}

export type TechmizeV2ConsultarDadosBasicosVeiculoResponseData = {
  dados_basicos: TechmizeV2ConsultarDadosBasicosVeiculoDadosBasicosVeiculo[]
}

export type TechmizeV2ConsultarDadosBasicosVeiculoResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV2ConsultarDadosBasicosVeiculoResponseData
  status_request: string
}
