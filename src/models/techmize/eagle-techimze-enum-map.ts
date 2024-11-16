import { PersonAnalysisTypeEnum, VehicleAnalysisTypeEnum } from '../dynamo/request-enum'

import { techmizeV2ConsultarANTTTypeRequest } from './v2/consultar-antt/request-body'
import { techmizeV2ConsultarCNHTypeRequest } from './v2/consultar-cnh/request-body'
import { techmizeV2ConsultarCNHV2TypeRequest } from './v2/consultar-cnh-v2/request-body'
import { techmizeV2ConsultarDadosBasicosPessoaFisicaTypeRequest } from './v2/consultar-dados-basicos-pessoa-fisica/request-body'
import { techmizeV2ConsultarDadosBasicosVeiculoTypeRequest } from './v2/consultar-dados-basicos-veiculo/request-body'
import { techmizeV2ConsultarProcessosTypeRequest } from './v2/consultar-processos/request-body'

export type EagleTechimzePersonAnalsisTypeEnumMapValue = typeof techmizeV2ConsultarDadosBasicosPessoaFisicaTypeRequest
  | typeof techmizeV2ConsultarCNHTypeRequest
  | typeof techmizeV2ConsultarCNHV2TypeRequest
  | typeof techmizeV2ConsultarProcessosTypeRequest

export type EagleTechimzeVehicleAnalsisTypeEnumMapValue = typeof techmizeV2ConsultarANTTTypeRequest
    | typeof techmizeV2ConsultarDadosBasicosVeiculoTypeRequest

export type EagleTechimzePersonAnalysisTypeEnumMap = Omit<Record<PersonAnalysisTypeEnum, EagleTechimzePersonAnalsisTypeEnumMapValue>, PersonAnalysisTypeEnum.HISTORY | PersonAnalysisTypeEnum.SIMPLE>

export type EagleTechimzeVehicleAnalysisTypeEnumMap = Omit<Record<VehicleAnalysisTypeEnum, EagleTechimzeVehicleAnalsisTypeEnumMapValue>, VehicleAnalysisTypeEnum.SIMPLE | VehicleAnalysisTypeEnum.VEHICLE_PLATE_HISTORY | VehicleAnalysisTypeEnum.VEHICLE_SECOND_DRIVER>

export const eagleTechimzePersonAnalysisTypeEnumMap: EagleTechimzePersonAnalysisTypeEnumMap = {
  [PersonAnalysisTypeEnum.BASIC_DATA]: techmizeV2ConsultarDadosBasicosPessoaFisicaTypeRequest,
  [PersonAnalysisTypeEnum.CNH_BASIC]: techmizeV2ConsultarCNHTypeRequest,
  [PersonAnalysisTypeEnum.CNH_STATUS]: techmizeV2ConsultarCNHV2TypeRequest,
  [PersonAnalysisTypeEnum.PROCESS]: techmizeV2ConsultarProcessosTypeRequest,
}

export const eagleTechimzeVehicleAnalysisTypeEnumMap: EagleTechimzeVehicleAnalysisTypeEnumMap = {
  [VehicleAnalysisTypeEnum.ANTT]: techmizeV2ConsultarANTTTypeRequest,
  [VehicleAnalysisTypeEnum.BASIC_DATA]: techmizeV2ConsultarDadosBasicosVeiculoTypeRequest,
}
