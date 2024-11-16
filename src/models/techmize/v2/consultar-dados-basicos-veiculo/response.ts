export type TechmizeV2ConsultarDadosBasicosVeiculoDadosBasicos = {
  placa: string
  debit_type_guid: string
  chassi: string
  numero_motor: string
  uf: string
  municipio: string
  renavam: string
  ano_fabricacao: number
  ano_modelo: number
  situacao: string
  modelo: string
  tipo_veiculo: string
  especie: string
  cor: string
  combustivel: string
  categoria: string
  capacidade: number
  ano_licenciamento: number
  nome_proprietario: string
  documento_proprietario: string
  tipo_documento_proprietario: string
  restricoes: any[]
}

export type TechmizeV2ConsultarDadosBasicosVeiculoDadosBasicosVeiculo = {
  dados_basicos: TechmizeV2ConsultarDadosBasicosVeiculoDadosBasicos
}

export type TechmizeV2ConsultarDadosBasicosVeiculoResponseData = {
  dados_basicos: TechmizeV2ConsultarDadosBasicosVeiculoDadosBasicosVeiculo
}

export type TechmizeV2ConsultarDadosBasicosVeiculoResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV2ConsultarDadosBasicosVeiculoResponseData
}
