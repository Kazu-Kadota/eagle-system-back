import { SQSEvent } from 'aws-lambda'

import { TechimzeSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import techmizeV1AnswerAnalysisCNH from './main'

export const handler = (event: SQSEvent) => {
  logger.setService('eaglerequest')

  const releaseExtract = new LambdaHandlerNameSpace
    .LambdaSQSHandlerFunction<TechimzeSQSReceivedMessageAttributes>(techmizeV1AnswerAnalysisCNH)

  return releaseExtract.handler(event)
}
