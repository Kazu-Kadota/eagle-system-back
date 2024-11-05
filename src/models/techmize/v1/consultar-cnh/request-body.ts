export const techmizeV1ConsultarCNHTypeRequest = 'cnh'

export type TechmizeV1ConsultarCNHRequestBody = {
  cpf: string
  type_request: typeof techmizeV1ConsultarCNHTypeRequest
}
