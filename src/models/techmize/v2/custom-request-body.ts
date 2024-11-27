import { TechmizeV2ConsultarANTTRequestBody } from './consultar-antt/request-body'
import { TechmizeV2ConsultarCNHRequestBody } from './consultar-cnh/request-body'
import { TechmizeV2ConsultarCNHV2RequestBody } from './consultar-cnh-v2/request-body'
import { TechmizeV2ConsultarDadosBasicosPessoaFisicaRequestBody } from './consultar-dados-basicos-pessoa-fisica/request-body'
import { TechmizeV2ConsultarDadosBasicosVeiculoRequestBody } from './consultar-dados-basicos-veiculo/request-body'
import { TechmizeV2ConsultarProcessosRequestBody } from './consultar-processos/request-body'

export type TechmizeV2CustomRequestBody = TechmizeV2ConsultarANTTRequestBody
  | TechmizeV2ConsultarCNHRequestBody
  | TechmizeV2ConsultarCNHV2RequestBody
  | TechmizeV2ConsultarDadosBasicosPessoaFisicaRequestBody
  | TechmizeV2ConsultarDadosBasicosVeiculoRequestBody
  | TechmizeV2ConsultarProcessosRequestBody
