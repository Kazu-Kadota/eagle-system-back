import { VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { eagleTechimzeVehicleAnalysisTypeEnumMap } from 'src/models/techmize/eagle-techimze-enum-map'
import { TechmizeV2ConsultarANTTRequestBody } from 'src/models/techmize/v2/consultar-antt/request-body'
import { TechmizeV2ConsultarDadosBasicosVeiculoRequestBody } from 'src/models/techmize/v2/consultar-dados-basicos-veiculo/request-body'
import { TechmizeV2GetResponseRequestBody } from 'src/models/techmize/v2/get-response-request-body'
import logger from 'src/utils/logger'

export type VehicleSnsMountMessageReturn = (TechmizeV2ConsultarANTTRequestBody
  | TechmizeV2ConsultarDadosBasicosVeiculoRequestBody) & TechmizeV2GetResponseRequestBody

export type VehicleSnsMountMessageParams = {
  cpf: string,
  licenseplate: string
  protocol: string
  vehicle_analysis_type: VehicleAnalysisTypeEnum,
}

const vehicleSnsMountMessage = ({
  cpf,
  licenseplate,
  protocol,
  vehicle_analysis_type,
}: VehicleSnsMountMessageParams): VehicleSnsMountMessageReturn | undefined => {
  switch (vehicle_analysis_type) {
    case VehicleAnalysisTypeEnum.ANTT: {
      return {
        cpf,
        licenseplate,
        protocol,
        type_request: eagleTechimzeVehicleAnalysisTypeEnumMap[VehicleAnalysisTypeEnum.ANTT],
      }
    }
    case VehicleAnalysisTypeEnum.BASIC_DATA: {
      return {
        cpf,
        licenseplate,
        protocol,
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
