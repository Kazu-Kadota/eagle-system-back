import { SFNClient } from '@aws-sdk/client-sfn'
import { defaultHeaders } from 'src/constants/headers'

import sendTaskFailure from 'src/services/aws/step-functions/send-task-failure'

import ErrorHandler from './error-handler'

const catchError = (err: any) => {
  if (err.isTreated) {
    return {
      headers: defaultHeaders,
      statusCode: err.code,
      body: JSON.stringify(err.toObject()),
    }
  }

  if (err.$metadata) {
    return {
      headers: defaultHeaders,
      statusCode: err.$metadata.httpStatusCode,
      body: JSON.stringify({
        message: 'AWS error: ' + err.name,
      }),
    }
  }

  return {
    headers: defaultHeaders,
    statusCode: 500,
    body: JSON.stringify({
      message: 'Internal Server Error',
    }),
  }
}

export type CatchErrorSQSStepFunction = {
  task_token: string
  err: any,
  sfnClient: SFNClient
}

export const catchErrorSQSStepFunction = async ({
  err,
  sfnClient,
  task_token,
}: CatchErrorSQSStepFunction) => {
  if (err.isTreated) {
    await sendTaskFailure({
      cause: err.message,
      code: err.code,
      sfnClient,
      task_token,
    })

    throw new ErrorHandler(err.message, err.code, err.details)
  }

  if (err.$metadata) {
    await sendTaskFailure({
      cause: err.name,
      code: err.$metadata.httpStatusCode,
      sfnClient,
      task_token,
    })

    throw new ErrorHandler('AWS error: ' + err.name, err.$metadata.httpStatusCode)
  }

  await sendTaskFailure({
    cause: 'Internal Server Error',
    code: 500,
    sfnClient,
    task_token,
  })

  throw new ErrorHandler('Internal Server Error', 500, err)
}

export default catchError
