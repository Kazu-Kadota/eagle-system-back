export type TechmizeV2ConsultarANTTResponseDataANTTDetails = {
  placa: string
  transportador: string
  numero_documento: string
  rnrtc: number
  situacao_rntrc: string
  data_cadastro: string
  municipio_uf: string
  obs: string[]
  /*
    Exemplo do retorno:
    "obs": [
      "Esse transportador está apto a realizar o transporte remunerado de cargas",
      "O veículo placa XXX0X00 está cadastrado na frota deste transportador e pode ser utilizado para o transporte remunerado de carga"
    ]
  */
}

export type TechmizeV2ConsultarANTTResponseDataANTT = {
  antt: TechmizeV2ConsultarANTTResponseDataANTTDetails
}

export type TechmizeV2ConsultarANTTResponseData = {
  antt: TechmizeV2ConsultarANTTResponseDataANTT[]
}

export type TechmizeV2ConsultarANTTResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV2ConsultarANTTResponseData
  status_request: string
}
