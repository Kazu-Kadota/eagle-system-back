import { SQSEvent } from 'aws-lambda'

import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import techmizeV2AnswerAnalysisPersonCNHV2 from './main'

export const handler = (event: SQSEvent & { taskToken: string }) => {
  logger.setService('eaglerequest')

  const releaseExtract = new LambdaHandlerNameSpace
    .LambdaStepFunctionFromSQSHandlerFunction<TechimzePersonSQSReceivedMessageAttributes>(techmizeV2AnswerAnalysisPersonCNHV2)

  return releaseExtract.handler(event)
}
