export const techmizeV1ConsultarANTTTypeRequest = 'antt'

export type TechmizeV1ConsultarANTTRequestBody = {
  licenseplate: string
  cpf: string
  type_request: typeof techmizeV1ConsultarANTTTypeRequest
}
