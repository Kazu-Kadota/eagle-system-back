import { SQSEvent } from 'aws-lambda'

import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import techmizeV1AnswerAnalysisPersonProcess from './main'

export const handler = (event: SQSEvent) => {
  logger.setService('eaglerequest')

  const releaseExtract = new LambdaHandlerNameSpace
    .LambdaSQSHandlerFunction<TechimzePersonSQSReceivedMessageAttributes>(techmizeV1AnswerAnalysisPersonProcess)

  return releaseExtract.handler(event)
}
