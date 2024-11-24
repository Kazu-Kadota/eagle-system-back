export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponsePhoneContactDetails = {
  Number: string
  AreaCode: string
  CountryCode: string
  Complement: string
  Type: string
  PhoneNumberOfEntities: number
  LastUpdateDate: string
}

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseAddressContactDetails = {
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

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseEmailsContactDetails = {
  EmailAddress: string
  Domain: string
  UserName: string
  Type: string
  LastUpdateDate: string
}

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponsePersonalContact<C extends string> = C extends 'email'
  ? TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseEmailsContactDetails
  : C extends 'address'
    ? TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseAddressContactDetails
    : C extends 'phone'
      ? TechmizeV2ConsultarDadosBasicosPessoaFisicaResponsePhoneContactDetails
      : never

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseEmailsAndPhoneContact<C extends string> = {
  Primary: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponsePersonalContact<C>[]
  Secondary: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponsePersonalContact<C>[]
}

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseAddressesContact<C extends string> = {
  Primary: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponsePersonalContact<C>
  Secondary: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponsePersonalContact<C>
}

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseBasicData = {
  TaxIdNumber: string
  Name: string
  Gender: string
  BirthDate: string
  MotherName: string
  TaxIdStatus: string
  TaxIdStatusDate: string
  NameUniquenessScore: number
}

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseRegistrationData = {
  BasicData: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseBasicData
  Emails: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseEmailsAndPhoneContact<'email'>
  Addresses: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseAddressesContact<'address'>
  Phones: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseEmailsAndPhoneContact<'phone'>
}

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseDadosBasicosPessoaFisicaResult = {
  MatchKeys: string
  RegistrationData: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseRegistrationData
}

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseData = {
  dados_cadastrais: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseDadosBasicosPessoaFisicaResult[]
}

export type TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV2ConsultarDadosBasicosPessoaFisicaResponseData
  status_request: string
}
