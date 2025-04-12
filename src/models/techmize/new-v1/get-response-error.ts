export type TechmizeNewV1GetResponseGenericErrorResponse = {
  code: 0
  message: string
  data: string | object
}

export type TechmizeNewV1GetResponseAuthenticationErrorResponse = {
  code: 0,
  message: 'Erro de autenticação!',
  data: 'Token vazio ou não informado!'
}

export type TechmizeNewV1GetResponseBadRequestErrorResponse = {
  code: 0,
  message: 'Erro de validação!',
  data: 'Protocolo não encontrado! (protocol)'
}

export const techmizeNewV1GetResponseNotFinishedErrorResponseMessage = 'Requisição não concluída! (status)'

export type TechmizeNewV1GetResponseNotFinishedErrorResponse = {
  code: 0,
  message: 'Erro de validação!',
  data: typeof techmizeNewV1GetResponseNotFinishedErrorResponseMessage
}

export const techmizeNewV1GetResponseProcessingResponseMessage = 'Erro de processamento!'

export type TechmizeNewV1GetResponseErrorOnProcessingResponse = {
  code: 0,
  message: typeof techmizeNewV1GetResponseProcessingResponseMessage,
  data: 'Requisição com erro de processamento! (status)'
}

export type TechmizeNewV1GetResponseReprocessingErrorResponse = {
  code: 0,
  message: typeof techmizeNewV1GetResponseProcessingResponseMessage,
  data: 'Requisição com erro, aguardando reprocessamento! (status)'
}

export type TechmizeNewV1GetResponseErrorResponse = TechmizeNewV1GetResponseGenericErrorResponse
  | TechmizeNewV1GetResponseAuthenticationErrorResponse
  | TechmizeNewV1GetResponseBadRequestErrorResponse
  | TechmizeNewV1GetResponseNotFinishedErrorResponse
  | TechmizeNewV1GetResponseErrorOnProcessingResponse
  | TechmizeNewV1GetResponseReprocessingErrorResponse
