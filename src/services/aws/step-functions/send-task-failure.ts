import { SendTaskFailureCommand, SFNClient } from '@aws-sdk/client-sfn'

import logger from 'src/utils/logger'

export type SendTaskFailure = {
  cause: string
  code: number
  task_token: string
  sfnClient: SFNClient
}

const sendTaskFailure = async ({
  cause,
  code,
  task_token,
  sfnClient,
}: SendTaskFailure) => {
  logger.debug({
    message: 'SFN: Send Task Failure',
    service: 'AWS',
    cause,
    code,
    task_token,
  })

  const command = new SendTaskFailureCommand({
    cause,
    error: code.toString(),
    taskToken: task_token,
  })

  await sfnClient.send(command)
}

export default sendTaskFailure
