import { SendTaskSuccessCommand, SFNClient } from '@aws-sdk/client-sfn'

import logger from 'src/utils/logger'

export type SendTaskSuccess = {
  output: any
  task_token: string
  sfnClient: SFNClient
}

const sendTaskSuccess = async ({
  output,
  sfnClient,
  task_token,
}: SendTaskSuccess) => {
  logger.debug({
    message: 'SFN: Send Task Success',
    service: 'AWS',
    output,
    task_token,
  })

  const command = new SendTaskSuccessCommand({
    output,
    taskToken: task_token,
  })

  await sfnClient.send(command)
}

export default sendTaskSuccess
