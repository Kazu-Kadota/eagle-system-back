import { SQSEvent } from 'aws-lambda'

import { TechimzeVehicleSQSReceivedMessageAttributes } from 'src/models/techmize/sqs-message-attributes'
import LambdaHandlerNameSpace from 'src/utils/lambda/handler'
import logger from 'src/utils/logger'

import techmizeV1AnswerAnalysisVehicleANTT from './main'

export const handler = (event: SQSEvent) => {
  logger.setService('eaglerequest')

  const releaseExtract = new LambdaHandlerNameSpace
    .LambdaSQSHandlerFunction<TechimzeVehicleSQSReceivedMessageAttributes>(techmizeV1AnswerAnalysisVehicleANTT)

  return releaseExtract.handler(event)
}
