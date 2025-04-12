import { TechmizeNewV1GetResponseSuccessResponse } from 'src/models/techmize/new-v1/get-response'

export const mockTechmizeNewV1AnswerAnalysisPersonCNHV2GetResponse: TechmizeNewV1GetResponseSuccessResponse = {
  code: 1,
  message: 'Requisição processada com sucesso!',
  data: {
    cnh_v2: {
      numero_registro: '98765432100',
      numero: '12345678900',
      url_foto: 'https://example.com/foto.jpg',
      categoria: 'C',
      data_expiracao: '2030-08-15',
      renach: 'MG987654321',
      primeira_cnh: '2012-04-10',
      data_emissao: '2020-08-15',
      nome: 'Carlos Pereira',
      nome_mae: 'Ana Pereira',
      nome_pai: 'Luis Pereira',
      email: 'carlos.pereira@email.com',
      telefone: '+55 31 99876-5432',
      numero_documento: '10987654321',
      data_nascimento: '1990-11-22',
      contagem_debitos: 0,
      bloqueios: [
        {
          data: '2023-01-10',
          descricao: 'Suspensão por excesso de pontos',
          dias_penalidade: 30,
          fim_penalidade: '2023-02-09',
          inicio_penalidade: '2023-01-10',
          uf: 'MG',
        },
      ],
      exames: [
        {
          nome: 'Psicotécnico',
          data: '2023-06-15',
          local: 'Clínica ABC',
          resultado: 'Apto',
          validade: '2026-06-15',
          categoria_pretendida: 'D',
          categoria_permitida: 'C',
          cidade: 'Belo Horizonte',
          uf: 'MG',
        },
      ],
      cursos: [
        {
          nome: 'Curso de Transporte Coletivo',
          data_inicio: '2022-02-01',
          data_fim: '2022-03-01',
          carga_horaria: 50,
          categoria: 'D',
          modalidade: 'Presencial',
          validade: '2027-02-01',
          cidade: 'Contagem',
          uf: 'MG',
        },
      ],
      toxicologico: {
        data_coleta: '2024-01-05',
        data_uso: '2024-01-01',
        situacao: 'Negativo',
        validade: '2025-01-05',
      },
    },
  },
}
