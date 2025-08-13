import {
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { SynthesisRequest, SynthesisRequestKey } from 'src/models/dynamo/request-synthesis'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

const DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED = getStringEnv('DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED')

const getRequestSynthesisFinished = async (
  key: SynthesisRequestKey,
  dynamodbClient: DynamoDBClient,
): Promise<SynthesisRequest | undefined> => {
  logger.debug({
    message: 'Getting finished synthesis by synthesis id',
    synthesis_id: key.synthesis_id,
  })

  const command = new GetItemCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_SYNTHESIS_FINISHED,
    Key: marshall(key),
  })

  const result = await dynamodbClient.send(command)

  if (!result.Item) {
    return undefined
  }

  return unmarshall(result.Item) as SynthesisRequest
}

export default getRequestSynthesisFinished
