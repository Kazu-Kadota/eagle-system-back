export const techmizeV1ConsultarProcessosTypeRequest = 'processos'

export type TechmizeV1ConsultarProcessosRequestBody = {
  cpf: string
  type_request: typeof techmizeV1ConsultarProcessosTypeRequest
}
