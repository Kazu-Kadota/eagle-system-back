export const techmizeV1ConsultarDadosBasicosVeiculoTypeRequest = 'dados_basicos_veiculo'

export type TechmizeV1ConsultarDadosBasicosVeiculoRequestBody = {
  licenseplate: string
  cpf: string
  type_request: typeof techmizeV1ConsultarDadosBasicosVeiculoTypeRequest
}
