import { TechmizeNewV1GetResponseSuccessResponse } from 'src/models/techmize/new-v1/get-response'

export const mockTechmizeNewV1AnswerAnalysisPersonBasicDataGetResponse: TechmizeNewV1GetResponseSuccessResponse = {
  code: 1,
  message: 'Requisição processada com sucesso!',
  data: {
    dados_cadastrais: {
      dados_basicos: {
        documento: '12345678900',
        nome: 'João da Silva',
        genero: 'Masculino',
        data_nascimento: '1985-05-20',
        nome_mae: 'Maria da Silva',
        situacao: 'Regular',
        data_situacao: '2024-12-15 10:30:00',
      },
      emails: [
        'joao.silva@email.com',
        'contato.joaosilva@provedor.com',
      ],
      enderecos: [
        {
          endereco: 'Rua das Flores',
          numero: '123',
          complemento: 'Apto 101',
          bairro: 'Jardim das Rosas',
          cep: '12345-678',
          cidade: 'São Paulo',
          estado: 'SP',
          pais: 'Brasil',
          tipo_endereco: 'Residencial',
          data_atualizacao: '2023-11-01 08:00:00',
        },
        {
          endereco: 'Avenida Central',
          numero: '456',
          bairro: 'Centro',
          cep: '87654-321',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
          pais: 'Brasil',
          tipo_endereco: 'Comercial',
          data_atualizacao: '2024-01-15 09:30:00',
        },
      ],
      telefones: [
        {
          numero: '998765432',
          codigo_area: '11',
          codigo_pais: '55',
          tipo: 'Celular',
          data_atualizacao: '2024-06-10 14:20:00',
        },
        {
          numero: '33445566',
          codigo_area: '21',
          codigo_pais: '55',
          tipo: 'Residencial',
          data_atualizacao: '2023-10-05 11:10:00',
        },
      ],
    },
  },
}
