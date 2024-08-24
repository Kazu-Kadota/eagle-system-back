import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

import { PersonRequest, PersonRequestKey } from '../../src/models/dynamo/request-person'
import { ReturnResponse } from '../../src/models/lambda'
import { createConditionExpression, createExpressionAttributeNames, createExpressionAttributeValues, createUpdateExpression } from '../../src/utils/dynamo/expression'
import getStringEnv from '../../src/utils/get-string-env'
import logger from '../../src/utils/logger'

const workspace = getStringEnv('WORKSPACE')

const DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON = `eaglerequest-finished-analysis-person-${workspace}`

const updateFinishedAnalysis = async (
  key: PersonRequestKey,
  body: Partial<PersonRequest>,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  const dynamoDocClient = DynamoDBDocumentClient.from(dynamodbClient)
  logger.debug({
    message: 'Updating finished analysis in table',
    person_id: key.person_id,
    request_id: key.request_id,
  })

  const now = new Date().toISOString()

  const update = {
    ...key,
    ...body,
    updated_at: now,
  }

  const command = new UpdateCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON,
    Key: key,
    ConditionExpression: createConditionExpression(key, true),
    ExpressionAttributeNames: createExpressionAttributeNames(update),
    ExpressionAttributeValues: createExpressionAttributeValues(update, true),
    UpdateExpression: createUpdateExpression(update, Object.keys(key)),
  })

  await dynamoDocClient.send(command)
}

export interface ScanPeopleRequest {
  company_name?: string
}

export interface ScanPeopleResponse {
  result: PersonRequest[],
  last_evaluated_key?: Record<string, AttributeValue>
}

const scanPeople = async (
  scan: ScanPeopleRequest,
  dynamodbClient: DynamoDBClient,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<ScanPeopleResponse | undefined> => {
  logger.debug({
    message: 'Scanning people',
    company_name: scan.company_name || 'admin',
  })

  const exclusive_start_key = last_evaluated_key

  const command = new ScanCommand({
    TableName: DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON,
    ExpressionAttributeNames: createExpressionAttributeNames(scan),
    ExpressionAttributeValues: createExpressionAttributeValues(scan),
    ExclusiveStartKey: exclusive_start_key,
    FilterExpression: createConditionExpression(scan, true),
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as PersonRequest))

  return {
    result,
    last_evaluated_key: LastEvaluatedKey,
  }
}

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

type PeopleToFix = {
  request_id: string
  person_id: string
}

const fixDocumentColumn = async (): Promise<ReturnResponse<any>> => {
  let last_evaluated_key
  const scan: ScanPeopleRequest = {}
  const people_to_fix: PeopleToFix[] = []
  const people_not_fixed: (PeopleToFix & { document: string })[] = []

  do {
    const scan_result: ScanPeopleResponse | undefined = await scanPeople(
      scan,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!scan_result) {
      logger.error('Something gone wrong')

      throw new Error('Something gone wrong')
    }

    if (scan_result.result) {
      for (const item of scan_result.result) {
        const document = item.document
        const match_document = document.match(/^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2})$/)

        if (!match_document) {
          const new_document_arr = [document.slice(0, 3), document.slice(3, 6), document.slice(6, 9), document.slice(9, 11)]
          const new_document = `${new_document_arr[0]}.${new_document_arr[1]}.${new_document_arr[2]}-${new_document_arr[3]}`

          const match_new_document = new_document.match(/^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2})$/)

          if (!match_new_document) {
            logger.warn({
              message: 'It is not expected pattern',
              person_id: item.person_id,
              request_id: item.request_id,
              document: item.document,
            })

            people_not_fixed.push({
              person_id: item.person_id,
              request_id: item.request_id,
              document: item.document,
            })
          }

          const { person_id, request_id, ...body } = item

          const person_request_key: PersonRequestKey = {
            person_id,
            request_id,
          }

          const person_request_body: Omit<PersonRequest, 'request_id' | 'person_id'> = {
            ...body,
            document: new_document,
          }

          await updateFinishedAnalysis(person_request_key, person_request_body, dynamodbClient)

          people_to_fix.push({
            person_id: item.person_id,
            request_id: item.request_id,
          })
        }
      }
    }

    last_evaluated_key = scan_result.last_evaluated_key
  } while (last_evaluated_key)

  logger.info({
    message: 'Finish on fix document column',
    people_to_fix,
    people_not_fixed,
  })

  return {
    body: {
      message: 'Finish on fix document column',
      people_to_fix,
      people_not_fixed,
    },
  }
}

const main = () => {
  fixDocumentColumn().then(console.log).catch(console.log)
}

main()
