import { MessageAttributeValue, PublishCommand, SNSClient } from '@aws-sdk/client-sns'

import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

export type PublishThirdPartySnsParams = {
  content: any,
  sns_message: string,
  sns_message_attributes: Record<string, MessageAttributeValue>,
  sns_client: SNSClient
}

const SNS_REQUESTPLUS_THIRD_PARTY_WORKERS_ARN = getStringEnv('SNS_REQUESTPLUS_THIRD_PARTY_WORKERS_ARN')

const publishThirdPartySns = async ({
  content,
  sns_message,
  sns_message_attributes,
  sns_client,
}: PublishThirdPartySnsParams) => {
  logger.debug({
    message: 'SNS: Publish',
    content,
  })

  const command = new PublishCommand({
    Message: sns_message,
    MessageAttributes: sns_message_attributes,
    TopicArn: SNS_REQUESTPLUS_THIRD_PARTY_WORKERS_ARN,
  })

  await sns_client.send(command)
}

export default publishThirdPartySns
