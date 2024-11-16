import { SNSClient } from '@aws-sdk/client-sns'

import { PersonAnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { SNSMessageAttributes, SNSThirdPartyWorkersPersonMessage } from 'src/models/sns'
import { TechimzePersonSQSSendMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import publishThirdPartySns, { PublishThirdPartySnsParams } from 'src/services/aws/sns/third_party/publish'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import personSnsMountMessage, { PersonSnsMountMessageParams } from './person-sns-mount-message'

type UseCaseSNSMessageAttributes = SNSMessageAttributes & TechimzePersonSQSSendMessageAttributes

export type UseCasePublishSnsTopicPersonParams = {
  cpf: string
  person_analysis_type: PersonAnalysisTypeEnum
  person_id: string,
  protocol: string,
  request_id: string,
  snsClient: SNSClient,
}

const useCasePublishSnsTopicPerson = async ({
  cpf,
  person_analysis_type,
  person_id,
  protocol,
  request_id,
  snsClient,
}: UseCasePublishSnsTopicPersonParams): Promise<void | undefined> => {
  const message: SNSThirdPartyWorkersPersonMessage = {
    person: {},
  }

  const sns_mount_message_params: PersonSnsMountMessageParams = {
    cpf,
    person_analysis_type,
    protocol,
  }

  message.person[person_analysis_type] = personSnsMountMessage(sns_mount_message_params)

  const sns_message = removeEmpty(message)

  if (Object.keys(sns_message).length === 0) {
    return undefined
  }

  const sns_message_attributes: UseCaseSNSMessageAttributes = {
    origin: {
      DataType: 'String',
      StringValue: 'eaglesystem',
    },
    person_id: {
      DataType: 'String',
      StringValue: person_id,
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
    content: person_analysis_type,
    sns_client: snsClient,
    sns_message: JSON.stringify(sns_message),
    sns_message_attributes,
  }

  await publishThirdPartySns(publish_third_party_sns_params)
}

export default useCasePublishSnsTopicPerson
