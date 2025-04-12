import { VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { eagleTechimzeVehicleAnalysisTypeEnumMap } from 'src/models/techmize/eagle-techimze-enum-map'
import { TechmizeNewV1ANTTRequestBody } from 'src/models/techmize/new-v1/antt/request-body'
import { TechmizeNewV1DadosBasicosVeiculoRequestBody } from 'src/models/techmize/new-v1/dados-basicos-veiculo/request-body'
import { TechmizeNewV1GetResponseRequestBody } from 'src/models/techmize/new-v1/get-response-request-body'
import { TechmizeNewV1StoreRequestVehicleParams } from 'src/services/techmize/new-v1/store-request'
import logger from 'src/utils/logger'

export type VehicleSnsMountMessageReturn = TechmizeNewV1StoreRequestVehicleParams & TechmizeNewV1GetResponseRequestBody

export type VehicleSnsMountMessageParams = {
  owner_document: string,
  plate: string
  protocol: string
  vehicle_analysis_type: VehicleAnalysisTypeEnum,
}

const vehicleSnsMountMessage = ({
  owner_document,
  plate,
  protocol,
  vehicle_analysis_type,
}: VehicleSnsMountMessageParams): VehicleSnsMountMessageReturn | undefined => {
  switch (vehicle_analysis_type) {
    case VehicleAnalysisTypeEnum.ANTT: {
      return {
        plate,
        cpf_cnpj: owner_document,
        protocol,
        type_request: eagleTechimzeVehicleAnalysisTypeEnumMap[VehicleAnalysisTypeEnum.ANTT],
      } as TechmizeNewV1ANTTRequestBody & TechmizeNewV1GetResponseRequestBody
    }
    case VehicleAnalysisTypeEnum.BASIC_DATA: {
      return {
        plate,
        protocol,
        type_request: eagleTechimzeVehicleAnalysisTypeEnumMap[VehicleAnalysisTypeEnum.BASIC_DATA],
      } as TechmizeNewV1DadosBasicosVeiculoRequestBody & TechmizeNewV1GetResponseRequestBody
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
