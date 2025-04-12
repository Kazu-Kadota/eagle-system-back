import { TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseSuccess } from 'src/models/techmize/v2/consultar-dados-basicos-pessoa-fisica/response'

export const mockTechmizeV2AnswerAnalysisPersonBasicDataGetResponse: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseSuccess = {
  code: 1,
  message: 'Consulta realizada com sucesso!',
  data: {
    dados_cadastrais: [
      [
        {
          MatchKeys: 'doc{00000000000}',
          RegistrationData: {
            BasicData: {
              TaxIdNumber: '00000000000',
              Name: 'NOME',
              Gender: 'M',
              BirthDate: '2000-01-01T00:00:00Z',
              MotherName: 'NOME MAE',
              TaxIdStatus: 'REGULAR',
              TaxIdStatusDate: '2024-01-01T00:00:00',
              NameUniquenessScore: 1,
            },
            Emails: {
              Primary: [],
              Secondary: [],
            },
            Addresses: {
              Primary: {
                Typology: 'R',
                Title: '',
                AddressMain: 'NOME RUA',
                Number: 'NÚMERO ENDEREÇO',
                Complement: '',
                Neighborhood: 'BAIRRO',
                ZipCode: '00000000',
                City: 'CIDADE',
                State: 'SP',
                Country: 'BRASIL',
                Type: 'HOME',
                ComplementType: '',
                LastUpdateDate: '2020-01-01T00:00:00Z',
              },
              Secondary: {
                Typology: 'VLA',
                Title: '',
                AddressMain: 'NOME RUA',
                Number: 'NÚMERO RUA',
                Complement: '',
                Neighborhood: 'BAIRRO',
                ZipCode: '00000000',
                City: 'CIDADE',
                State: 'SP',
                Country: 'BRASIL',
                Type: 'HOME',
                ComplementType: '',
                LastUpdateDate: '2020-01-01T00:00:00Z',
              },
            },
            Phones: {
              Primary: [],
              Secondary: [],
            },
          },
        },
      ],
    ],
  },
  status_request: 'PROCESSADO',
}
