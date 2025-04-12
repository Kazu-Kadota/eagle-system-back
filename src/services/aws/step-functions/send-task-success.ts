import { SendTaskSuccessCommand, SFNClient } from '@aws-sdk/client-sfn'

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
  const command = new SendTaskSuccessCommand({
    output,
    taskToken: task_token,
  })

  await sfnClient.send(command)
}

export default sendTaskSuccess
