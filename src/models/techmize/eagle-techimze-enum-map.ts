import { PersonAnalysisTypeEnum, VehicleAnalysisTypeEnum } from '../dynamo/request-enum'

import { techmizeNewV1ANTTTypeRequest } from './new-v1/antt/request-body'
import { techmizeNewV1CNHTypeRequest } from './new-v1/cnh/request-body'
import { techmizeNewV1CNHV2TypeRequest } from './new-v1/cnh-v2/request-body'
import { techmizeNewV1DadosBasicosPessoaFisicaTypeRequest } from './new-v1/dados-basicos-pessoa-fisica/request-body'
import { techmizeNewV1DadosBasicosVeiculoTypeRequest } from './new-v1/dados-basicos-veiculo/request-body'
import { techmizeNewV1DadosBasicosVeiculoV2TypeRequest } from './new-v1/dados-basicos-veiculo-v2/request-body'
import { techmizeNewV1ProcessosTypeRequest } from './new-v1/processos/request-body'

export type EagleTechimzePersonAnalsisTypeEnumMapValue = typeof techmizeNewV1DadosBasicosPessoaFisicaTypeRequest
  | typeof techmizeNewV1CNHTypeRequest
  | typeof techmizeNewV1CNHV2TypeRequest
  | typeof techmizeNewV1ProcessosTypeRequest

export type EagleTechimzeVehicleAnalsisTypeEnumMapValue = typeof techmizeNewV1ANTTTypeRequest
  | typeof techmizeNewV1DadosBasicosVeiculoTypeRequest
  | typeof techmizeNewV1DadosBasicosVeiculoV2TypeRequest

export type EagleTechimzePersonAnalysisTypeEnumMap = Omit<Record<PersonAnalysisTypeEnum, EagleTechimzePersonAnalsisTypeEnumMapValue>, PersonAnalysisTypeEnum.HISTORY | PersonAnalysisTypeEnum.SIMPLE>

export type EagleTechimzeVehicleAnalysisTypeEnumMap = Omit<Record<VehicleAnalysisTypeEnum, EagleTechimzeVehicleAnalsisTypeEnumMapValue>, VehicleAnalysisTypeEnum.SIMPLE | VehicleAnalysisTypeEnum.VEHICLE_PLATE_HISTORY | VehicleAnalysisTypeEnum.VEHICLE_SECOND_DRIVER>

export const eagleTechimzePersonAnalysisTypeEnumMap: EagleTechimzePersonAnalysisTypeEnumMap = {
  [PersonAnalysisTypeEnum.BASIC_DATA]: techmizeNewV1DadosBasicosPessoaFisicaTypeRequest,
  [PersonAnalysisTypeEnum.CNH_BASIC]: techmizeNewV1CNHTypeRequest,
  [PersonAnalysisTypeEnum.CNH_STATUS]: techmizeNewV1CNHV2TypeRequest,
  [PersonAnalysisTypeEnum.PROCESS]: techmizeNewV1ProcessosTypeRequest,
}

export const eagleTechimzeVehicleAnalysisTypeEnumMap: EagleTechimzeVehicleAnalysisTypeEnumMap = {
  [VehicleAnalysisTypeEnum.ANTT]: techmizeNewV1ANTTTypeRequest,
  [VehicleAnalysisTypeEnum.BASIC_DATA]: techmizeNewV1DadosBasicosVeiculoTypeRequest,
  [VehicleAnalysisTypeEnum.BASIC_DATA_V2]: techmizeNewV1DadosBasicosVeiculoV2TypeRequest,
}
