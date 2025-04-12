export type TechmizeNewV1DadosBasicosVeiculoV2DadosVeiculo = {
  placa: string
  placa_pre_mercosul?: string
  chassi: string
  chassi_remarcado: boolean
  numero_motor: string
  estado_placa: string
  cidade_placa: string
  renavam: string
  ano_fabricacao: number
  ano_modelo: number
  capacidade_tracao?: number
  peso_bruto_total?: number
  marca_modelo: string
  codigo_marca_modelo: string
  grupo_veiculo: string
  tipo_veiculo: string
  especie: string
  cor: string
  combustivel: string
  categoria: string
  origem: string
  potencia?: number
  cilindradas?: number
  eixos?: number
  capacidade?: number
  capacidade_tanque?: number
  capacidade_carga?: number
  ultimo_licenciamento: number
  ativo: boolean
  situacao_licenciamento: string
  licenciado_ate: string
}

export type TechmizeNewV1DadosBasicosVeiculoV2RestricoesVeiculo = {
  renainf: boolean
  renajud: boolean
  rfb: boolean
  roubo_furto: boolean
  ocorrencia: string
  recall: boolean
  sinistro: boolean
}

export type TechmizeNewV1DadosBasicosVeiculoV2Proprietario = {
  nome: string
  documento: string
  tipo_documento: string
}

export type TechmizeNewV1DadosBasicosVeiculoV2Alienacao = {
  instituicao: string
  documento: string
}

export type TechmizeNewV1DadosBasicosVeiculoV2NaturezaJuridica = {
  codigo: string
  descricao: string
}

export type TechmizeNewV1DadosBasicosVeiculoV2Contatos = {
  telefones?: string[]
  emails?: string[]
}

export type TechmizeNewV1DadosBasicosVeiculoV2Endereco = {
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  cidade: string
  estado: string
}

export type TechmizeNewV1DadosBasicosVeiculoV2DadosProprietario = {
  nome: string
  nome_mae?: string
  nome_pai?: string
  situacao: string
  porte?: string
  data_abertura?: string
  natureza_juridica?: TechmizeNewV1DadosBasicosVeiculoV2NaturezaJuridica
  capital_social?: string
  razao_social?: string
  documento: string
  data_nascimento?: string
  contatos?: TechmizeNewV1DadosBasicosVeiculoV2Contatos
  enderecos?: TechmizeNewV1DadosBasicosVeiculoV2Endereco[]
}

export type TechmizeNewV1DadosBasicosVeiculoV2Result = {
  dados_veiculo: TechmizeNewV1DadosBasicosVeiculoV2DadosVeiculo
  restricoes: TechmizeNewV1DadosBasicosVeiculoV2RestricoesVeiculo
  proprietario: TechmizeNewV1DadosBasicosVeiculoV2Proprietario
  alienacao: TechmizeNewV1DadosBasicosVeiculoV2Alienacao
  dados_proprietario: TechmizeNewV1DadosBasicosVeiculoV2DadosProprietario
}

export type TechmizeNewV1DadosBasicosVeiculoV2ResponseData = {
  dados_basicos_veiculo: TechmizeNewV1DadosBasicosVeiculoV2Result
}
