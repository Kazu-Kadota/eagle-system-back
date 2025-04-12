export type TechmizeNewV1DadosBasicosPessoaFisicaResponseTelefones = {
  numero: string
  codigo_area: string
  codigo_pais: string
  complemento?: string
  tipo: string
  data_atualizacao: string // YYYY-MM-DD HH:MM:SS
}

export type TechmizeNewV1DadosBasicosPessoaFisicaResponseEnderecos = {
  endereco: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  cidade: string
  estado: string
  pais: string
  tipo_endereco: string
  data_atualizacao: string // YYYY-MM-DD HH:MM:SS
}

export type TechmizeNewV1DadosBasicosPessoaFisicaResponseEmails = string

export type TechmizeNewV1DadosBasicosPessoaFisicaResponseDadosBasicos = {
  documento: string
  nome: string
  genero: string
  data_nascimento: string // YYYY-MM-DD
  nome_mae: string
  situacao: string
  data_situacao: string // YYYY-MM-DD HH:MM:SS
}

export type TechmizeNewV1DadosBasicosPessoaFisicaResponseDataDadosCadastraisResult = {
  dados_basicos: TechmizeNewV1DadosBasicosPessoaFisicaResponseDadosBasicos
  emails: Array<TechmizeNewV1DadosBasicosPessoaFisicaResponseEmails>
  enderecos: Array<TechmizeNewV1DadosBasicosPessoaFisicaResponseEnderecos>
  telefones: Array<TechmizeNewV1DadosBasicosPessoaFisicaResponseTelefones>
}

export type TechmizeNewV1DadosBasicosPessoaFisicaResponseData = {
  dados_cadastrais: TechmizeNewV1DadosBasicosPessoaFisicaResponseDataDadosCadastraisResult
}
