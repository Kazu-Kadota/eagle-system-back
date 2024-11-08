import { TechmizeV1AuthenticationErrorResponse, TechmizeV1GenericErrorResponse } from '../error'

export type TechmizeV1ConsultarDadosBasicosVeiculoDadosBasicos = {
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

export type TechmizeV1ConsultarDadosBasicosVeiculoDadosBasicosVeiculo = {
  dados_basicos: TechmizeV1ConsultarDadosBasicosVeiculoDadosBasicos
}

export type TechmizeV1ConsultarDadosBasicosVeiculoResponseData = {
  dados_basicos: TechmizeV1ConsultarDadosBasicosVeiculoDadosBasicosVeiculo
}

export type TechmizeV1ConsultarDadosBasicosVeiculoResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV1ConsultarDadosBasicosVeiculoResponseData
}

export type TechmizeV1ConsultarDadosBasicosVeiculoResponse = TechmizeV1GenericErrorResponse | TechmizeV1AuthenticationErrorResponse | TechmizeV1ConsultarDadosBasicosVeiculoResponseSuccess
