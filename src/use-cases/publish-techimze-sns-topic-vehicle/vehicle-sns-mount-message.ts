import { VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { eagleTechimzeVehicleAnalysisTypeEnumMap } from 'src/models/techmize/eagle-techimze-enum-map'
import { TechmizeV1ConsultarANTTRequestBody } from 'src/models/techmize/v1/consultar-antt/request-body'
import { TechmizeV1ConsultarDadosBasicosVeiculoRequestBody } from 'src/models/techmize/v1/consultar-dados-basicos-veiculo/request-body'
import logger from 'src/utils/logger'

export type VehicleSnsMountMessageReturn = TechmizeV1ConsultarANTTRequestBody
  | TechmizeV1ConsultarDadosBasicosVeiculoRequestBody

export type VehicleSnsMountMessageParams = {
  cpf: string,
  licenseplate: string
  vehicle_analysis_type: VehicleAnalysisTypeEnum,
}

const vehicleSnsMountMessage = ({
  cpf,
  licenseplate,
  vehicle_analysis_type,
}: VehicleSnsMountMessageParams): VehicleSnsMountMessageReturn | undefined => {
  switch (vehicle_analysis_type) {
    case VehicleAnalysisTypeEnum.ANTT: {
      return {
        cpf,
        licenseplate,
        type_request: eagleTechimzeVehicleAnalysisTypeEnumMap[VehicleAnalysisTypeEnum.ANTT],
      }
    }
    case VehicleAnalysisTypeEnum.BASIC_DATA: {
      return {
        cpf,
        licenseplate,
        type_request: eagleTechimzeVehicleAnalysisTypeEnumMap[VehicleAnalysisTypeEnum.BASIC_DATA],
      }
    }
    default:
      logger.warn({
        message: 'There is no option in vehicle analysis type to mount sns message',
        vehicle_analysis_type,
      })
      return undefined
  }
}

export default vehicleSnsMountMessage
