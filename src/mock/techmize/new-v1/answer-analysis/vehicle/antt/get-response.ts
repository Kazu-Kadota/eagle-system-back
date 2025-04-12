import { TechmizeNewV1GetResponseSuccessResponse } from 'src/models/techmize/new-v1/get-response'

export const mockTechmizeNewV1AnswerAnalysisVehicleANTTGetResponse: TechmizeNewV1GetResponseSuccessResponse = {
  code: 1,
  message: 'Requisição processada com sucesso!',
  data: {
    antt: {
      placa: 'XYZ1A23',
      transportador: 'Transportadora Veloz Ltda.',
      numero_documento: '12345678000195',
      rnrtc: 987654,
      situacao_rntrc: 'Ativo',
      data_cadastro: '2020-08-15',
      municipio_uf: 'São Paulo/SP',
      obs: [
        'Esse transportador está apto a realizar o transporte remunerado de cargas',
        'O veículo placa XYZ1A23 está cadastrado na frota deste transportador e pode ser utilizado para o transporte remunerado de carga',
      ],
    },
  },
}
