import { PersonAnalysisTypeEnum, VehicleAnalysisTypeEnum } from '../dynamo/request-enum'

import { techmizeV1ConsultarANTTTypeRequest } from './v1/consultar-antt/request-body'
import { techmizeV1ConsultarCNHTypeRequest } from './v1/consultar-cnh/request-body'
import { techmizeV1ConsultarCNHV2TypeRequest } from './v1/consultar-cnh-v2/request-body'
import { techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest } from './v1/consultar-dados-basicos-pessoa-fisica/request-body'
import { techmizeV1ConsultarDadosBasicosVeiculoTypeRequest } from './v1/consultar-dados-basicos-veiculo/request-body'
import { techmizeV1ConsultarProcessosTypeRequest } from './v1/consultar-processos/request-body'

export type EagleTechimzePersonAnalsisTypeEnumMapValue = typeof techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest
  | typeof techmizeV1ConsultarCNHTypeRequest
  | typeof techmizeV1ConsultarCNHV2TypeRequest
  | typeof techmizeV1ConsultarProcessosTypeRequest

export type EagleTechimzeVehicleAnalsisTypeEnumMapValue = typeof techmizeV1ConsultarANTTTypeRequest
    | typeof techmizeV1ConsultarDadosBasicosVeiculoTypeRequest

export const eagleTechimzePersonAnalysisTypeEnumMap: Omit<Record<PersonAnalysisTypeEnum, EagleTechimzePersonAnalsisTypeEnumMapValue>, PersonAnalysisTypeEnum.HISTORY | PersonAnalysisTypeEnum.SIMPLE> = {
  [PersonAnalysisTypeEnum.BASIC_DATA]: techmizeV1ConsultarDadosBasicosPessoaFisicaTypeRequest,
  [PersonAnalysisTypeEnum.CNH_BASIC]: techmizeV1ConsultarCNHTypeRequest,
  [PersonAnalysisTypeEnum.CNH_STATUS]: techmizeV1ConsultarCNHV2TypeRequest,
  [PersonAnalysisTypeEnum.PROCESS]: techmizeV1ConsultarProcessosTypeRequest,
}

export const eagleTechimzeVehicleAnalysisTypeEnumMap: Omit<Record<VehicleAnalysisTypeEnum, EagleTechimzeVehicleAnalsisTypeEnumMapValue>, VehicleAnalysisTypeEnum.SIMPLE | VehicleAnalysisTypeEnum.VEHICLE_PLATE_HISTORY | VehicleAnalysisTypeEnum.VEHICLE_SECOND_DRIVER> = {
  [VehicleAnalysisTypeEnum.ANTT]: techmizeV1ConsultarANTTTypeRequest,
  [VehicleAnalysisTypeEnum.BASIC_DATA]: techmizeV1ConsultarDadosBasicosVeiculoTypeRequest,
}
