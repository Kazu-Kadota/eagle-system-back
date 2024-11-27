import { SQSEvent } from 'aws-lambda'

import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import techmizeV2AnswerAnalysisPersonProcess from './main'

export const handler = (event: SQSEvent & { taskToken: string }) => {
  logger.setService('eaglerequest')

  const releaseExtract = new LambdaHandlerNameSpace
    .LambdaStepFunctionFromSQSHandlerFunction<TechimzePersonSQSReceivedMessageAttributes>(techmizeV2AnswerAnalysisPersonProcess)

  return releaseExtract.handler(event)
}
