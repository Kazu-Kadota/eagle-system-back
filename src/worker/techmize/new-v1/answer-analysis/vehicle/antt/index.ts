import { SQSEvent } from 'aws-lambda'

import { TechimzeVehicleSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import techmizeNewV1AnswerAnalysisVehicleANTT from './main'

export const handler = (event: SQSEvent & { taskToken: string }) => {
  logger.setService('eaglerequest')

  const releaseExtract = new LambdaHandlerNameSpace
    .LambdaStepFunctionFromSQSHandlerFunction<TechimzeVehicleSQSReceivedMessageAttributes>(techmizeNewV1AnswerAnalysisVehicleANTT)

  return releaseExtract.handler(event)
}
