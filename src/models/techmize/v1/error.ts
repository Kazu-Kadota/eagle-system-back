export type TechmizeV1GenericErrorResponse = {
  code: 0
  message: string
  data: string | object
}

export type TechmizeV1AuthenticationErrorResponse = {
  code: 0,
  message: 'Erro de autenticação!',
  data: 'Token vazio ou não informado!'
}
