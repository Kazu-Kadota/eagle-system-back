import { TranssatGetSynthesisResponse } from 'src/models/dynamo/transsat/get-synthesis/response'

export const mockTranssatGetSynthesisResponse: TranssatGetSynthesisResponse = {
  nome_da_mae: 'ROSALVA RIOS BRITES',
  quantidade: 2,
  ocorrencias: [
    {
      numero_nacional_procedimento: '301/2019',
      condutor_do_veiculo: 'Não Informado',
      relato:
        'O caminhão tombou na rodovia, e parte da carga de café foi furtada por desconhecidos. O motorista não estava presente no local.',
      data: '28/02/2019',
      laudo: false,
      natureza_ocorrencia: 'Furto',
      testemunha: 'AUGUSTO TAKAYA',
      vitima: 'LUIZ RIOS BRITES',
      situacao_procedimento: 'Aguardando Perícia',
      municipio: 'MIRACATU',
      autor: 'DESCONHECIDO',
      unidade_policial_registro: 'DEL.POL.MIRACATU',
    },
    {
      numero_nacional_procedimento: '310/2019',
      condutor_do_veiculo: 'Não Informado',
      relato:
        'Quatro indivíduos armados roubaram o caminhão e a carga. O motorista foi mantido em cativeiro.',
      data: '27/02/2019',
      laudo: false,
      natureza_ocorrencia: 'Roubo',
      testemunha: 'Não Informado',
      vitima: 'LUIZ RIOS BRITES',
      situacao_procedimento: 'Instrução Finalizada',
      municipio: 'S.LOURENCO DA SERRA',
      autor: 'DESCONHECIDO',
      unidade_policial_registro: 'DEL. POL. S.LOURENCO SERR',
    },
  ],
  cpf: '01536547751',
  data_nascimento: '03/05/1966',
  nome: 'LUIZ RIOS BRITES',
}
