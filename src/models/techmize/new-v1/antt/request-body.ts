export const techmizeNewV1ANTTTypeRequest = 'antt'

export type TechmizeNewV1ANTTRequestBody = {
  plate: string
  cpf_cnpj: string
  type_request: typeof techmizeNewV1ANTTTypeRequest
}
