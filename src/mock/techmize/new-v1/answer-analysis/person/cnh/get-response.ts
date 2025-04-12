import { TechmizeNewV1GetResponseSuccessResponse } from 'src/models/techmize/new-v1/get-response'

export const mockTechmizeNewV1AnswerAnalysisPersonCNHGetResponse: TechmizeNewV1GetResponseSuccessResponse = {
  code: 1,
  message: 'Requisição processada com sucesso!',
  data: {
    cnh: {
      numero_registro: '12345678900',
      numero: '98765432100',
      categoria: 'B',
      data_expiracao: '2029-07-10',
      renach: 'SP123456789',
      primeira_cnh: '2010-05-20',
      data_emissao: '2019-07-10',
      nome: 'João da Silva',
      nome_mae: 'Maria da Silva',
      nome_pai: 'José da Silva',
      email: 'joao.silva@email.com',
      telefone: '+55 11 91234-5678',
      numero_documento: '12345678901',
      data_nascimento: '1985-03-25',
    },
  },
}
