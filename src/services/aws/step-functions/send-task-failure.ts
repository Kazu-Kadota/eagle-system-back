import { SendTaskFailureCommand, SFNClient } from '@aws-sdk/client-sfn'

import logger from 'src/utils/logger'

export type SendTaskFailure = {
  err: any
  cause: string
  code: number
  task_token: string
  sfnClient: SFNClient
}

const sendTaskFailure = async ({
  cause,
  code,
  err,
  task_token,
  sfnClient,
}: SendTaskFailure) => {
  logger.error({
    message: 'SFN: Send Task Failure',
    service: 'AWS',
    err,
    cause,
    code,
  })

  const command = new SendTaskFailureCommand({
    cause,
    error: code.toString(),
    taskToken: task_token,
  })

  await sfnClient.send(command)
}

export default sendTaskFailure
