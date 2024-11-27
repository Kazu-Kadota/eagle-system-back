export type TechmizeV2GetRequestGenericErrorResponse = {
  code: 0
  message: string
  data: string | object
}

export type TechmizeV2GetRequestAuthenticationErrorResponse = {
  code: 0,
  message: 'Erro de autenticação!',
  data: 'Token vazio ou não informado!'
}

export type TechmizeV2GetRequestBadRequestErrorResponse = {
  code: 0,
  message: "Parâmetro 'protocol' obrigatório!",
  data: null
}

export type TechmizeV2GetRequestUnknownErrorResponse = {
  code: 0,
  message: 'Consulta com erro!',
  data: null,
  status_request: 'ERRO'
}

export type TechmizeV2GetRequestProcessedWithoutResponseErrorResponse = {
  code: 0,
  message: 'Consulta processada sem retorno!',
  data: null,
  status_request: 'PROCESSADO SEM RETORNO'
}

export type TechmizeV2GetRequestNotFinishedErrorResponse = {
  code: 0,
  message: 'Consulta não finalizada!',
  data: null,
  status_request: 'STATUS DIFERENTE DE PROCESSADO QUE NÃO ATENDA A NENHUMA CONDIÇÃO ACIMA'
}

export const techmizeV2GetRequestProcessingResponseMessage = 'A consulta está sendo processada. Tente novamente mais tarde!'

export type TechmizeV2GetRequestProcessingResponse = {
  code: 0,
  message: typeof techmizeV2GetRequestProcessingResponseMessage,
  data: null | {
    current_status: 'AGUARDANDO'
  }
}

export type TechmizeV2GetRequestErrorResponse = TechmizeV2GetRequestGenericErrorResponse
  | TechmizeV2GetRequestAuthenticationErrorResponse
  | TechmizeV2GetRequestBadRequestErrorResponse
  | TechmizeV2GetRequestUnknownErrorResponse
  | TechmizeV2GetRequestProcessedWithoutResponseErrorResponse
  | TechmizeV2GetRequestNotFinishedErrorResponse
  | TechmizeV2GetRequestProcessingResponse
