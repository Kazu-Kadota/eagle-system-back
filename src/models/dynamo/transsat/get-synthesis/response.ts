export type TranssatGetSynthesisResponseOcorrencia = {
  numero_nacional_procedimento: string
  condutor_do_veiculo: string
  relato: string
  data: string
  laudo: boolean
  natureza_ocorrencia: string
  testemunha: string
  vitima: string
  situacao_procedimento: string
  municipio: string
  autor: string
  unidade_policial_registro: string
}

export type TranssatGetSynthesisResponse = {
  nome_da_mae: string
  quantidade: number
  ocorrencias: TranssatGetSynthesisResponseOcorrencia[]
  cpf: string
  data_nascimento: string
  nome: string
}
