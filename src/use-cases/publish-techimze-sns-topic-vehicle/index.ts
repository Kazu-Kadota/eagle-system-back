import { SNSClient } from '@aws-sdk/client-sns'

import { VehicleAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SNSMessageAttributes, SNSThirdPartyWorkersVehicleMessage } from 'src/models/sns'

import { TechimzeVehicleSQSSendMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import publishThirdPartySns, { PublishThirdPartySnsParams } from 'src/services/aws/sns/third_party/publish'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import vehicleSnsMountMessage, { VehicleSnsMountMessageParams } from './vehicle-sns-mount-message'

type UseCaseSNSMessageAttributes = SNSMessageAttributes & TechimzeVehicleSQSSendMessageAttributes

export type UseCasePublishSnsTopicVehicleParams = {
  owner_document: string
  plate: string
  request_id: string,
  snsClient: SNSClient,
  vehicle_analysis_type: VehicleAnalysisTypeEnum
  vehicle_id: string,
}

const useCasePublishSnsTopicVehicle = async ({
  owner_document,
  plate,
  vehicle_analysis_type,
  vehicle_id,
  request_id,
  snsClient,
}: UseCasePublishSnsTopicVehicleParams): Promise<void | undefined> => {
  const message: SNSThirdPartyWorkersVehicleMessage = {
    vehicle: {},
  }

  const sns_mount_message_params: VehicleSnsMountMessageParams = {
    cpf: owner_document,
    licenseplate: plate,
    vehicle_analysis_type,
  }

  message.vehicle[vehicle_analysis_type] = vehicleSnsMountMessage(sns_mount_message_params)

  const sns_message = removeEmpty(message)

  if (Object.keys(sns_message).length === 0) {
    return undefined
  }

  const sns_message_attributes: UseCaseSNSMessageAttributes = {
    origin: {
      DataType: 'String',
      StringValue: 'eaglesystem',
    },
    vehicle_id: {
      DataType: 'String',
      StringValue: vehicle_id,
    },
    request_id: {
      DataType: 'String',
      StringValue: request_id,
    },
    requestId: {
      DataType: 'String',
      StringValue: logger.config.request_id,
    },
  }

  const publish_third_party_sns_params: PublishThirdPartySnsParams = {
    content: vehicle_analysis_type,
    sns_client: snsClient,
    sns_message: JSON.stringify(sns_message),
    sns_message_attributes,
  }

  await publishThirdPartySns(publish_third_party_sns_params)
}

export default useCasePublishSnsTopicVehicle
