export type TechmizeNewV1ANTTResponseDataANTTResult = {
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

export type TechmizeNewV1ConsultarANTTResponseData = {
  antt: TechmizeNewV1ANTTResponseDataANTTResult
}
