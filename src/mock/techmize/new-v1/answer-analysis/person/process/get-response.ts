import { TechmizeNewV1GetResponseSuccessResponse } from 'src/models/techmize/new-v1/get-response'

export const mockTechmizeNewV1AnswerAnalysisPersonProcessGetResponse: TechmizeNewV1GetResponseSuccessResponse = {
  code: 1,
  message: 'Requisição processada com sucesso!',
  data: {
    processos_judiciais_administrativos: {
      processos: [
        {
          numero: '1234567890',
          tipo: 'Ação Civil Pública',
          assunto_principal: 'Direitos do consumidor',
          nome_tribunal: 'Tribunal de Justiça de São Paulo',
          nivel_tribunal: 1,
          tipo_tribunal: 'TJ-SP',
          distrito_tribunal: 'São Paulo',
          juiz: 'Dr. João da Silva',
          vara_tribunal: '1ª Vara Cível',
          estado: 'SP',
          status: 'Em andamento',
          servico_processo: 'Jurisdição Contenciosa',
          processos_relacionados: ['1234567891', '1234567892'],
          assunto_cnj_inferido: 'Direito do Consumidor',
          numero_cnj_inferido: '12345678901234',
          artigo: 'Art. 12, CDC',
          dispositivo_legal: 'Código de Defesa do Consumidor',
          glossario: 'Defesa do Consumidor',
          tipo_processo_cnj_inferido: 'Cível',
          numero_tipo_processo_cnj_inferido: '12345',
          assunto_cnj_amplo_inferido: 'Direitos do Consumidor',
          numero_assunto_cnj_amplo_inferido: '67890',
          outros_assuntos: ['Fraude', 'Contratos'],
          numero_volumes: 10,
          numero_paginas: 250,
          valor: 50000,
          data_transito_em_julgado: '2024-03-20 10:15:00',
          data_arquivamento: '2024-03-25 11:30:00',
          data_redistribuicao: '2024-03-23 09:00:00',
          data_publicacao: '2024-03-18 12:45:00',
          data_notificacao: '2024-03-19 14:20:00',
          data_ultima_movimentacao: '2024-03-26 15:30:00',
          data_captura: '2024-03-27 16:00:00',
          ultima_atualizacao: '2024-03-26 17:00:00',
          numero_partes: 3,
          numero_atualizacoes: 5,
          idade_processo: 6,
          media_atualizacoes_por_mes: 1,
          motivo_dados_ocultos: 'Dados confidenciais',
          partes: [
            {
              documento: '123.456.789-00',
              parte_ativa: true,
              nome: 'João da Silva',
              polaridade: 'Autor',
              detalhes_partes: { tipo_especifico: 'Pessoa Física' },
              data_ultima_captura: '2024-03-27 16:00:00',
            },
            {
              documento: '987.654.321-00',
              parte_ativa: false,
              nome: 'Maria Oliveira',
              polaridade: 'Réu',
              detalhes_partes: { tipo_especifico: 'Pessoa Física' },
              data_ultima_captura: '2024-03-27 16:00:00',
            },
          ],
          atualizacoes: [
            {
              conteudo: 'Processo atualizado com novos documentos anexados.',
              data_publicacao: '2024-03-18 12:45:00',
              data_captura: '2024-03-19 14:20:00',
            },
            {
              conteudo: 'Decisão favorável ao autor.',
              data_publicacao: '2024-03-20 10:15:00',
              data_captura: '2024-03-21 09:45:00',
            },
          ],
          peticoes: [
            {
              tipo: 'Petição inicial',
              autor: 'João da Silva',
              data_criacao: '2024-03-10 09:00:00',
              data_juntada: '2024-03-11 10:00:00',
            },
            {
              tipo: 'Petição de contestação',
              autor: 'Maria Oliveira',
              data_criacao: '2024-03-12 10:30:00',
              data_juntada: '2024-03-13 11:00:00',
            },
          ],
          decisoes: [
            {
              conteudo_decisao: 'Decisão favorável ao autor, com fixação de indenização.',
              data_decisao: '2024-03-20 10:15:00',
            },
          ],
        },
      ],
      total_processos: 1,
      total_como_autor: 1,
      total_como_reu: 0,
      total_como_outro: 0,
      data_primeiro_processo: '2024-03-10 09:00:00',
      data_ultimo_processo: '2024-03-27 16:00:00',
      ultimos_30_dias: 1,
      ultimos_90_dias: 1,
      ultimos_180_dias: 1,
      ultimos_365_dias: 1,
    },
  },
}
