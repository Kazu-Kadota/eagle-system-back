import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { eagleTechimzePersonAnalysisTypeEnumMap } from 'src/models/techmize/eagle-techimze-enum-map'
import { TechmizeV2ConsultarCNHRequestBody } from 'src/models/techmize/v2/consultar-cnh/request-body'
import { TechmizeV2ConsultarCNHV2RequestBody } from 'src/models/techmize/v2/consultar-cnh-v2/request-body'
import { TechmizeV2ConsultarDadosBasicosPessoaFisicaRequestBody } from 'src/models/techmize/v2/consultar-dados-basicos-pessoa-fisica/request-body'
import { TechmizeV2ConsultarProcessosRequestBody } from 'src/models/techmize/v2/consultar-processos/request-body'
import { TechmizeV2GetResponseRequestBody } from 'src/models/techmize/v2/get-response-request-body'
import logger from 'src/utils/logger'

export type PersonSnsMountMessageReturn = (TechmizeV2ConsultarCNHRequestBody
  | TechmizeV2ConsultarDadosBasicosPessoaFisicaRequestBody
  | TechmizeV2ConsultarCNHV2RequestBody
  | TechmizeV2ConsultarProcessosRequestBody) & TechmizeV2GetResponseRequestBody

export type PersonSnsMountMessageParams = {
  cpf: string,
  person_analysis_type: PersonAnalysisTypeEnum,
  protocol: string
}

const personSnsMountMessage = ({
  cpf,
  person_analysis_type,
  protocol,
}: PersonSnsMountMessageParams): PersonSnsMountMessageReturn | undefined => {
  switch (person_analysis_type) {
    case PersonAnalysisTypeEnum.BASIC_DATA: {
      return {
        cpf,
        type_request: eagleTechimzePersonAnalysisTypeEnumMap[PersonAnalysisTypeEnum.BASIC_DATA],
        protocol,
      }
    }
    case PersonAnalysisTypeEnum.CNH_BASIC: {
      return {
        cpf,
        type_request: eagleTechimzePersonAnalysisTypeEnumMap[PersonAnalysisTypeEnum.CNH_BASIC],
        protocol,
      }
    }
    case PersonAnalysisTypeEnum.CNH_STATUS: {
      return {
        cpf,
        type_request: eagleTechimzePersonAnalysisTypeEnumMap[PersonAnalysisTypeEnum.CNH_STATUS],
        protocol,
      }
    }
    case PersonAnalysisTypeEnum.PROCESS:
      return {
        cpf,
        type_request: eagleTechimzePersonAnalysisTypeEnumMap[PersonAnalysisTypeEnum.PROCESS],
        protocol,
      }
    default:
      logger.warn({
        message: 'There is no option in person analysis type to mount sns message',
        person_analysis_type,
      })
      return undefined
  }
}

export default personSnsMountMessage
