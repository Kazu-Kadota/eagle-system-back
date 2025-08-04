export type TranssatGetSynthesisResponseOcorrencia = {
  autor: string
  condutor_do_veiculo: string
  data: string
  id_ocorrencias: number
  laudo: boolean
  municipio: string
  natureza_ocorrencia: string
  numero_nacional_procedimento: string
  relato: string
  situacao_procedimento: string
  testemunha: string
  unidade_policial_registro: string
  vitima: string
}

export type TranssatGetSynthesisResponse = {
  cpf: string
  data_nascimento: string
  nome_mae: string
  nome: string
  ocorrencias: TranssatGetSynthesisResponseOcorrencia[]
  qtd: number
  referencia: string
}
