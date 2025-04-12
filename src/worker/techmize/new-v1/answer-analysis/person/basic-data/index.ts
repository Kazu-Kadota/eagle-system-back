import { SQSEvent } from 'aws-lambda'

import { TechimzePersonSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import techmizeNewV1AnswerAnalysisPersonBasicData from './main'

export const handler = (event: SQSEvent & { taskToken: string }) => {
  logger.setService('eaglerequest')

  const releaseExtract = new LambdaHandlerNameSpace
    .LambdaStepFunctionFromSQSHandlerFunction<TechimzePersonSQSReceivedMessageAttributes>(techmizeNewV1AnswerAnalysisPersonBasicData)

  return releaseExtract.handler(event)
}
