import { SyntheisRequestReceiveMetadata } from '../../request-synthesis'

export type TranssatPostbackSynthesisOcorrencia = {
  autor: string
  condutor_do_veiculo: string
  data: string
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

export type TranssatPostbackSynthesisBody = {
  cpf: string
  data_nascimento: string
  metadata: SyntheisRequestReceiveMetadata
  nome: string
  nome_da_mae: string
  ocorrencias: TranssatPostbackSynthesisOcorrencia[]
  quantidade: number
  referencia: string
}
