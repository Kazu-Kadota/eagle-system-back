import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import { EventBridgeThirdPartyAnalysisAnswerProducerDetailsType, EventBridgeThirdPartyAnalysisAnswerProducerSource } from 'src/models/eventbridge/third-party-analysis-answer-producer'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

export type EventBridgeAnalysisAnswerProducerPutEventParams = {
  detail_type: EventBridgeThirdPartyAnalysisAnswerProducerDetailsType
  detail: Record<string, any>
  eventBridgeClient: EventBridgeClient
  source: EventBridgeThirdPartyAnalysisAnswerProducerSource
}

const EVENTBRIDGE_ANALYSIS_ANSWER_PRODUCER_PUT_EVENT = getStringEnv('EVENTBRIDGE_ANALYSIS_ANSWER_PRODUCER_PUT_EVENT')

const eventBridgeAnalysisAnswerProducerPutEvent = async ({
  detail_type,
  detail,
  eventBridgeClient,
  source,
}: EventBridgeAnalysisAnswerProducerPutEventParams) => {
  logger.debug({
    message: 'EventBridge: PutEvent',
    event_bridge: EVENTBRIDGE_ANALYSIS_ANSWER_PRODUCER_PUT_EVENT,
    source,
    detail_type,
  })

  const put_command = new PutEventsCommand({
    Entries: [{
      Source: source,
      Detail: JSON.stringify(detail),
      DetailType: detail_type,
      EventBusName: EVENTBRIDGE_ANALYSIS_ANSWER_PRODUCER_PUT_EVENT,
    }],
  })

  await eventBridgeClient.send(put_command)
}

export default eventBridgeAnalysisAnswerProducerPutEvent
