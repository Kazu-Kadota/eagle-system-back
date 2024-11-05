export const techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest = 'dados_basicos_pessoa_fisica'

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody = {
  cpf: string
  type_request: typeof techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest
}
