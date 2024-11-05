import { PersonAnalysisTypeEnum } from '../dynamo/request-enum'

import { techmizeV1ConsultarCNHTypeRequest } from './v1/consultar-cnh/request-body'
import { techmizeV1ConsultarCNHV2TypeRequest } from './v1/consultar-cnh-v2/request-body'
import { techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest } from './v1/consultar-dados-basicos-pessoa-fisica/request-body'
import { techmizeV1ConsultarProcessosTypeRequest } from './v1/consultar-processos/request-body'

export type EagleTechimzeEnumMapValue = typeof techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest
  | typeof techmizeV1ConsultarCNHTypeRequest
  | typeof techmizeV1ConsultarCNHV2TypeRequest
  | typeof techmizeV1ConsultarProcessosTypeRequest

export const eagleTechimzeEnumMap: Omit<Record<PersonAnalysisTypeEnum, EagleTechimzeEnumMapValue>, PersonAnalysisTypeEnum.HISTORY | PersonAnalysisTypeEnum.SIMPLE> = {
  [PersonAnalysisTypeEnum.BASIC_DATA]: techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest,
  [PersonAnalysisTypeEnum.CNH_BASIC]: techmizeV1ConsultarCNHTypeRequest,
  [PersonAnalysisTypeEnum.CNH_STATUS]: techmizeV1ConsultarCNHV2TypeRequest,
  [PersonAnalysisTypeEnum.PROCESS]: techmizeV1ConsultarProcessosTypeRequest,
}
