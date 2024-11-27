export const techmizeV2ConsultarANTTTypeRequest = 'antt'

export type TechmizeV2ConsultarANTTRequestBody = {
  licenseplate: string
  cpf: string
  type_request: typeof techmizeV2ConsultarANTTTypeRequest
}
