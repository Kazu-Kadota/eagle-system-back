import { TechmizeNewV1ANTTRequestBody } from './antt/request-body'
import { TechmizeNewV1CNHRequestBody } from './cnh/request-body'
import { TechmizeNewV1CNHV2RequestBody } from './cnh-v2/request-body'
import { TechmizeNewV1DadosBasicosPessoaFisicaRequestBody } from './dados-basicos-pessoa-fisica/request-body'
import { TechmizeNewV1DadosBasicosVeiculoRequestBody } from './dados-basicos-veiculo/request-body'
import { TechmizeNewV1DadosBasicosVeiculoV2RequestBody } from './dados-basicos-veiculo-v2/request-body'
import { TechmizeNewV1ProcessosRequestBody } from './processos/request-body'

export type TechmizeNewV1StoreRequestBody = TechmizeNewV1ANTTRequestBody
  | TechmizeNewV1CNHRequestBody
  | TechmizeNewV1CNHV2RequestBody
  | TechmizeNewV1DadosBasicosPessoaFisicaRequestBody
  | TechmizeNewV1DadosBasicosVeiculoRequestBody
  | TechmizeNewV1DadosBasicosVeiculoV2RequestBody
  | TechmizeNewV1ProcessosRequestBody
