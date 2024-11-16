export const techmizeV2ConsultarDadosBasicosPessoaFisicaTypeRequest = 'dados_basicos_pessoa_fisica'

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaRequestBody = {
  cpf: string
  type_request: typeof techmizeV2ConsultarDadosBasicosPessoaFisicaTypeRequest
}
