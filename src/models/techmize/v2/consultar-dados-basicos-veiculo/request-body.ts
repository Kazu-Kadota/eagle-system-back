export const techmizeV2ConsultarDadosBasicosVeiculoTypeRequest = 'dados_basicos_veiculo'

export type TechmizeV2ConsultarDadosBasicosVeiculoRequestBody = {
  licenseplate: string
  cpf: string
  type_request: typeof techmizeV2ConsultarDadosBasicosVeiculoTypeRequest
}
