import { TechmizeNewV1ConsultarANTTResponseData } from './antt/response'
import { TechmizeNewV1CNHResponseData } from './cnh/response'
import { TechmizeNewV1CNHV2ResponseData } from './cnh-v2/response'
import { TechmizeNewV1DadosBasicosPessoaFisicaResponseData } from './dados-basicos-pessoa-fisica/response'
import { TechmizeNewV1DadosBasicosVeiculoResponseData } from './dados-basicos-veiculo/response'
import { TechmizeNewV1DadosBasicosVeiculoV2ResponseData } from './dados-basicos-veiculo-v2/response'
import { TechmizeNewV1ProcessosResponseData } from './processos/response'

export type TechmizeNewV1GetResponseSuccessResponse = {
  code: 1,
  message: 'Requisição processada com sucesso!',
  data: TechmizeNewV1ConsultarANTTResponseData
    | TechmizeNewV1CNHResponseData
    | TechmizeNewV1CNHV2ResponseData
    | TechmizeNewV1DadosBasicosPessoaFisicaResponseData
    | TechmizeNewV1DadosBasicosVeiculoResponseData
    | TechmizeNewV1DadosBasicosVeiculoV2ResponseData
    | TechmizeNewV1ProcessosResponseData
}
