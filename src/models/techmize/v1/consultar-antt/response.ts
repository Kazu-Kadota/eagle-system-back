import { TechmizeV1AuthenticationErrorResponse, TechmizeV1GenericErrorResponse, TechmizeV1SuccessErrorResponse } from '../error'

export type TechmizeV1ConsultarANTTResponseDataANTTDetails = {
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

export type TechmizeV1ConsultarANTTResponseDataANTT = {
  antt: TechmizeV1ConsultarANTTResponseDataANTTDetails
}

export type TechmizeV1ConsultarANTTResponseData = {
  antt: TechmizeV1ConsultarANTTResponseDataANTT | TechmizeV1SuccessErrorResponse
}

export type TechmizeV1ConsultarANTTResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV1ConsultarANTTResponseData
}

export type TechmizeV1ConsultarANTTResponse = TechmizeV1GenericErrorResponse | TechmizeV1AuthenticationErrorResponse | TechmizeV1ConsultarANTTResponseSuccess
