import { MessageAttributeValue } from '@aws-sdk/client-sns'

import { PersonAnalysisTypeEnum, VehicleAnalysisTypeEnum } from './dynamo/request-enum'

export type SNSMessageAttributes = {
  origin: MessageAttributeValue,
  requestId: MessageAttributeValue,
}

export type SNSThirdPartyWorkersPersonMessage<T = any> =
  Partial<Record<PersonAnalysisTypeEnum, T>>
  & {}

export type SNSThirdPartyWorkersVehicleMessage<T = any> =
  Partial<Record<VehicleAnalysisTypeEnum, T>>
  & {}
