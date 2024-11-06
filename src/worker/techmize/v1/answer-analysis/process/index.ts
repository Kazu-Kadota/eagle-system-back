import { SQSEvent } from 'aws-lambda'

import { TechimzeSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import datavalidVerifyResultPfFacial from './main'

export const handler = (event: SQSEvent) => {
  logger.setService('eaglerequest')

  const releaseExtract = new LambdaHandlerNameSpace
    .LambdaSQSHandlerFunction<TechimzeSQSReceivedMessageAttributes>(datavalidVerifyResultPfFacial)

  return releaseExtract.handler(event)
}
