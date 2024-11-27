export const techmizeV2ConsultarCNHTypeRequest = 'cnh'

export type TechmizeV2ConsultarCNHRequestBody = {
  cpf: string
  type_request: typeof techmizeV2ConsultarCNHTypeRequest
}
