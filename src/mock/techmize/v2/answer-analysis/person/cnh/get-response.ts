import { TechmizeV2ConsultarCNHResponseSuccess } from 'src/models/techmize/v2/consultar-cnh/response'

export const mockTechmizeV2AnswerAnalysisPersonCNHGetResponse: TechmizeV2ConsultarCNHResponseSuccess = {
  code: 1,
  message: 'Consulta realizada com sucesso!',
  data: {
    cnh: [
      {
        cnh: {
          numero_registro: '00000000000',
          numero: '0000000000',
          categoria: 'AB',
          data_expiracao: '2030-01-01T03:00:00.000Z',
          renach: 'SP000000000',
          primeira_cnh: '2000-01-01T03:00:00.000Z',
          data_emissao: '2020-01-01T03:00:00.000Z',
          guid: '00000000-0000-0000-0000-000000000000',
          nome: 'NOME',
          nome_mae: 'NOME MÃE',
          nome_pai: 'NOME PAI',
          email: null,
          telefone: null,
          numero_documento: '00000000000',
          data_nascimento: '2000-01-01T03:00:00.000Z',
          contagem_debitos: null,
          tipos_debito: [],
        },
      },
    ],
  },
  status_request: 'PROCESSADO',
}
