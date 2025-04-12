export const techmizeNewV1ProcessosTypeRequest = 'processos_v2'

export type TechmizeNewV1ProcessosRequestBody = {
  cpf: string
  type_request: typeof techmizeNewV1ProcessosTypeRequest
}
