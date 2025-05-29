import { SFNClient } from '@aws-sdk/client-sfn'
import { defaultHeaders } from 'src/constants/headers'

import sendTaskFailure from 'src/services/aws/step-functions/send-task-failure'

import ErrorHandler from './error-handler'
import logger from './logger'

const catchError = (err: any) => {
  if (err.isTreated) {
    return {
      headers: defaultHeaders,
      statusCode: err.code,
      body: JSON.stringify(err.toObject()),
    }
  }

  if (err.$metadata) {
    logger.error({
      message: 'AWS error',
      err,
    })

    return {
      headers: defaultHeaders,
      statusCode: err.$metadata.httpStatusCode,
      body: JSON.stringify({
        message: 'Erro no servidor. Contatar o time técnico. ' + err.name,
      }),
    }
  }

  return {
    headers: defaultHeaders,
    statusCode: 500,
    body: JSON.stringify({
      message: 'Erro no servidor. Contatar o time técnico. ' + err.name,
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
      err,
      sfnClient,
      task_token,
    })

    throw new ErrorHandler(err.message, err.code, err.details)
  }

  if (err.$metadata) {
    await sendTaskFailure({
      cause: err.name,
      code: err.$metadata.httpStatusCode,
      err,
      sfnClient,
      task_token,
    })

    throw new ErrorHandler('AWS error: ' + err.name, err.$metadata.httpStatusCode)
  }

  await sendTaskFailure({
    cause: 'Internal Server Error',
    code: 500,
    err,
    sfnClient,
    task_token,
  })

  throw new ErrorHandler('Internal Server Error', 500, err)
}

export default catchError
