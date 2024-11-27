import { TechmizeV2ConsultarANTTResponseSuccess } from 'src/models/techmize/v2/consultar-antt/response'

export const mockTechmizeV2AnswerAnalysisVehicleANTTGetResponse: TechmizeV2ConsultarANTTResponseSuccess = {
  code: 1,
  message: 'Consulta realizada com sucesso!',
  data: {
    antt: [
      {
        antt: {
          placa: 'AAA1A11',
          transportador: 'nome transportador',
          numero_documento: 'XXX.000.000-XX',
          rnrtc: 12345678,
          situacao_rntrc: 'ATIVO',
          data_cadastro: '01/01/2012',
          municipio_uf: 'São Paulo/SP',
          obs: [
            'Esse transportador está apto a realizar o transporte remunerado de cargas',
            'O veículo placa AAA1A11 está cadastrado na frota deste transportador e pode ser utilizado para o transporte remunerado de carga',
          ],
        },
      },
    ],
  },
  status_request: 'PROCESSADO',
}
