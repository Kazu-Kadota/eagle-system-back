import { TechmizeV1AuthenticationErrorResponse, TechmizeV1GenericErrorResponse } from '../error'

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponsePhoneContactDetails = {
  Number: string
  AreaCode: string
  CountryCode: string
  Complement: string
  Type: string
  PhoneNumberOfEntities: number
  LastUpdateDate: string
}

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseAddressContactDetails = {
  Typology: string
  Title: string
  AddressMain: string
  Number: string
  Complement: string
  Neighborhood: string
  ZipCode: string
  City: string
  State: string
  Country: string
  Type: string
  ComplementType: string
  LastUpdateDate: string
}

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseEmailsContactDetails = {
  EmailAddress: string
  Domain: string
  UserName: string
  Type: string
  LastUpdateDate: string
}

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponsePersonalContact<C extends string> = C extends 'email'
  ? TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseEmailsContactDetails
  : C extends 'address'
    ? TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseAddressContactDetails
    : C extends 'phone'
      ? TechmizeV1ConsultarDadosBasicosPessoaFisicaResponsePhoneContactDetails
      : never

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseEmailsContact<C extends string> = {
  Primary: TechmizeV1ConsultarDadosBasicosPessoaFisicaResponsePersonalContact<C>[]
  Secondary: TechmizeV1ConsultarDadosBasicosPessoaFisicaResponsePersonalContact<C>[]
}

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseBasicData = {
  TaxIdNumber: string
  Name: string
  Gender: string
  BirthDate: string
  MotherName: string
  TaxIdStatus: string
  TaxIdStatusDate: string
  NameUniquenessScore: number
}

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseRegistrationData = {
  BasicData: TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseBasicData
  Emails: TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseEmailsContact<'email'>
  Addresses: TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseEmailsContact<'address'>
  Phones: TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseEmailsContact<'phone'>
}

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseDadosBasicosPessoaFisicaResult = {
  MatchKeys: string
  RegistrationData: TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseRegistrationData
}

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseData = {
  dados_cadastrais: TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseDadosBasicosPessoaFisicaResult[]
}

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaSuccessResponse = {
  code: 1
  message: string
  data: TechmizeV1ConsultarDadosBasicosPessoaFisicaResponseData
}

export type TechmizeV1ConsultarDadosBasicosPessoaFisicaResponse = TechmizeV1GenericErrorResponse | TechmizeV1AuthenticationErrorResponse | TechmizeV1ConsultarDadosBasicosPessoaFisicaSuccessResponse
