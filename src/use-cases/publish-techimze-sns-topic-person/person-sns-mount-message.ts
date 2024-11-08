import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { eagleTechimzePersonAnalysisTypeEnumMap } from 'src/models/techmize/eagle-techimze-enum-map'
import { TechmizeV1ConsultarCNHRequestBody } from 'src/models/techmize/v1/consultar-cnh/request-body'
import { TechmizeV1ConsultarCNHV2RequestBody } from 'src/models/techmize/v1/consultar-cnh-v2/request-body'
import { TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody } from 'src/models/techmize/v1/consultar-dados-basicos-pessoa-fisica/request-body'
import { TechmizeV1ConsultarProcessosRequestBody } from 'src/models/techmize/v1/consultar-processos/request-body'
import logger from 'src/utils/logger'

export type PersonSnsMountMessageReturn = TechmizeV1ConsultarCNHRequestBody
  | TechmizeV1ConsultarDadosBasicosPessoaFisicaRequestBody
  | TechmizeV1ConsultarCNHV2RequestBody
  | TechmizeV1ConsultarProcessosRequestBody

export type PersonSnsMountMessageParams = {
  cpf: string,
  person_analysis_type: PersonAnalysisTypeEnum,
}

const personSnsMountMessage = ({
  cpf,
  person_analysis_type,
}: PersonSnsMountMessageParams): PersonSnsMountMessageReturn | undefined => {
  switch (person_analysis_type) {
    case PersonAnalysisTypeEnum.BASIC_DATA: {
      return {
        cpf,
        type_request: eagleTechimzePersonAnalysisTypeEnumMap[PersonAnalysisTypeEnum.BASIC_DATA],
      }
    }
    case PersonAnalysisTypeEnum.CNH_BASIC: {
      return {
        cpf,
        type_request: eagleTechimzePersonAnalysisTypeEnumMap[PersonAnalysisTypeEnum.CNH_BASIC],
      }
    }
    case PersonAnalysisTypeEnum.CNH_STATUS: {
      return {
        cpf,
        type_request: eagleTechimzePersonAnalysisTypeEnumMap[PersonAnalysisTypeEnum.CNH_STATUS],
      }
    }
    case PersonAnalysisTypeEnum.PROCESS:
      return {
        cpf,
        type_request: eagleTechimzePersonAnalysisTypeEnumMap[PersonAnalysisTypeEnum.PROCESS],
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
