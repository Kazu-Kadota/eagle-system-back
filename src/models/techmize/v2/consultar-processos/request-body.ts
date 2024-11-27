export const techmizeV2ConsultarProcessosTypeRequest = 'processos'

export type TechmizeV2ConsultarProcessosRequestBody = {
  cpf: string
  type_request: typeof techmizeV2ConsultarProcessosTypeRequest
}
