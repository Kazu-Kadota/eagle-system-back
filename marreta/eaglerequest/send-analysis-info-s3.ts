import {
  DynamoDBClient,
  ScanCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { splitEvery } from 'ramda'
import { FinishedVehicleRequestPlateHistory } from 'src/models/dynamo/request-vehicle-plate-history'
import { gzipSync } from 'zlib'

import { AnalysisTypeEnum, PersonAnalysisTypeEnum, PersonThirdPartyEnum, StateEnum, VehicleAnalysisTypeEnum, VehicleThirdPartyEnum } from '../../src/models/dynamo/request-enum'
import { PersonRequest, PersonRequestKey } from '../../src/models/dynamo/request-person'
import { VehicleRequest, VehicleRequestKey } from '../../src/models/dynamo/request-vehicle'
import { createConditionExpression, createExpressionAttributeNames, createExpressionAttributeValues, createUpdateExpression } from '../../src/utils/dynamo/expression'
import ErrorHandler from '../../src/utils/error-handler'
import logger from '../../src/utils/logger'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })
const s3Client = new S3Client({ region: 'us-east-1' })

const WORKSPACES = {
  sdx: 'sdx',
  prd: 'prd',
}

const WORKSPACE = process.env.WORKSPACE as keyof typeof WORKSPACES

const DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON = {
  sdx: 'eaglerequest-finished-analysis-person-sdx',
  prd: 'eaglerequest-finished-analysis-person-prd',
}

const DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE = {
  sdx: 'eaglerequest-finished-analysis-vehicle-sdx',
  prd: 'eaglerequest-finished-analysis-vehicle-prd',
}

const S3_PERSON_ANALYSIS_ANSWER = {
  sdx: 'eaglerequest-person-analysis-answer-sdx',
  prd: 'eaglerequest-person-analysis-answer-prd',
}

const S3_VEHICLE_ANALYSIS_ANSWER = {
  sdx: 'eaglerequest-vehicle-analysis-answer-sdx',
  prd: 'eaglerequest-vehicle-analysis-answer-prd',
}

type scanPersonResponse = {
  result: PersonRequest[],
  last_evaluated_key?: Record<string, AttributeValue>
}

const scanPerson = async (
  dynamodbClient: DynamoDBClient,
  table: string,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<scanPersonResponse | undefined> => {
  const command = new ScanCommand({
    TableName: table,
    ExclusiveStartKey: last_evaluated_key,
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

const updatePerson = (
  key: PersonRequestKey,
  body: Partial<PersonRequest>,
  table: string,
): any => {
  const now = new Date().toISOString()

  const update: Partial<PersonRequest> = {
    ...key,
    ...body,
    updated_at: now,
  }

  return {
    Update: {
      TableName: table,
      Key: key,
      UpdateExpression: createUpdateExpression(update, Object.keys(key)),
      ExpressionAttributeNames: createExpressionAttributeNames(update),
      ExpressionAttributeValues: createExpressionAttributeValues(update, true),
      ConditionExpression: createConditionExpression(key, true),
    },
  }
}

type S3PersonAnalysisAnswerPut = {
  analysis_type: AnalysisTypeEnum
  bucket: string
  body?: string
  person_analysis_type: PersonAnalysisTypeEnum
  person_id: string
  third_party?: string
  region?: StateEnum
  request_id: string
  s3_client: S3Client
}

const s3PersonAnalysisAnswerPut = async ({
  analysis_type,
  body,
  person_analysis_type,
  person_id,
  region,
  request_id,
  third_party,
  s3_client,
  bucket,
}: S3PersonAnalysisAnswerPut) => {
  let key = `${analysis_type}/${person_id}/${request_id}/answer`

  if (third_party !== undefined) {
    key = key.concat(`/${third_party}/${person_analysis_type}`)
  } else {
    key = key.concat(`/${person_analysis_type}`)
  }

  if (region) {
    key = key.concat('_', region, '.json')
  } else {
    key = key.concat('.json')
  }

  const body_uncompressed = body ?? ''

  const gzip_body = gzipSync(body_uncompressed)

  const put_command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: gzip_body.toString('base64'),
  })

  await s3_client.send(put_command)

  return key
}

type scanVehicleResponse = {
  result: FinishedVehicleRequestPlateHistory[],
  last_evaluated_key?: Record<string, AttributeValue>
}

const scanVehicle = async (
  dynamodbClient: DynamoDBClient,
  table: string,
  last_evaluated_key?: Record<string, AttributeValue>,
): Promise<scanVehicleResponse | undefined> => {
  const command = new ScanCommand({
    TableName: table,
    ExclusiveStartKey: last_evaluated_key,
  })

  const { Items, LastEvaluatedKey } = await dynamodbClient.send(command)

  if (!Items) {
    return undefined
  }

  const result = Items.map((item) => (unmarshall(item) as FinishedVehicleRequestPlateHistory))

  return {
    result,
    last_evaluated_key: LastEvaluatedKey,
  }
}

const updateVehicle = (
  key: VehicleRequestKey,
  body: Partial<FinishedVehicleRequestPlateHistory>,
  table: string,
): any => {
  const now = new Date().toISOString()

  const update: Partial<VehicleRequest> = {
    ...key,
    ...body,
    updated_at: now,
  }

  return {
    Update: {
      TableName: table,
      Key: key,
      UpdateExpression: createUpdateExpression(update, Object.keys(key)),
      ExpressionAttributeNames: createExpressionAttributeNames(update),
      ExpressionAttributeValues: createExpressionAttributeValues(update, true),
      ConditionExpression: createConditionExpression(key, true),
    },
  }
}

type S3VehicleAnalysisAnswerPut = {
  analysis_type: AnalysisTypeEnum
  body?: string
  bucket: string
  region?: StateEnum
  request_id: string
  s3_client: S3Client
  third_party?: string
  vehicle_analysis_type: VehicleAnalysisTypeEnum
  vehicle_id: string
}

const s3VehicleAnalysisAnswerPut = async ({
  analysis_type,
  bucket,
  body,
  region,
  request_id,
  s3_client,
  third_party,
  vehicle_analysis_type,
  vehicle_id,
}: S3VehicleAnalysisAnswerPut) => {
  let key = `${analysis_type}/${vehicle_id}/${request_id}/answer`

  if (third_party !== undefined) {
    key = key.concat(`/${third_party}/${vehicle_analysis_type}`)
  } else {
    key = key.concat(`/${vehicle_analysis_type}`)
  }

  if (region) {
    key = key.concat('_', region, '.json')
  } else {
    key = key.concat('.json')
  }

  const body_uncompressed = body ?? ''

  const gzip_body = gzipSync(body_uncompressed)

  const put_command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: gzip_body.toString('base64'),
  })

  await s3_client.send(put_command)

  return key
}

const main = async () => {
  try {
    let last_evaluated_key: Record<string, AttributeValue> | undefined

    const person_update_analysis: Array<any> = []

    logger.debug({
      message: 'Scanning finished analysis person',
      table: DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON[WORKSPACE],
    })

    do {
      const result = await scanPerson(dynamodbClient, DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON[WORKSPACE], last_evaluated_key)

      if (result) {
        last_evaluated_key = result.last_evaluated_key
        if (result.result) {
          for (const item of result.result) {
            const analysis_info = item.analysis_info
            const is_json = analysis_info?.split('.')[1] === 'json'

            if (is_json) {
              continue
            }

            const s3_key = await s3PersonAnalysisAnswerPut({
              analysis_type: item.analysis_type,
              bucket: S3_PERSON_ANALYSIS_ANSWER[WORKSPACE],
              person_analysis_type: item.person_analysis_type,
              person_id: item.person_id,
              request_id: item.request_id,
              s3_client: s3Client,
              body: analysis_info,
              third_party: item.third_party ? PersonThirdPartyEnum.TECHMIZE : undefined,
              region: item.region,
            })

            const update = updatePerson({
              request_id: item.request_id,
              person_id: item.person_id,
            }, {
              analysis_info: s3_key,
            },
            DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_PERSON[WORKSPACE],
            )

            person_update_analysis.push(update)
          }
        }
      }
    } while (last_evaluated_key)

    const vehicle_update_analysis: Array<any> = []

    logger.debug({
      message: 'Scanning finished analysis vehicle',
      table: DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE[WORKSPACE],
    })

    do {
      const result = await scanVehicle(dynamodbClient, DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE[WORKSPACE], last_evaluated_key)

      if (result) {
        last_evaluated_key = result.last_evaluated_key
        if (result.result) {
          for (const item of result.result) {
            const analysis_info = item.analysis_info
            const is_json = analysis_info?.split('.')[1] === 'json'

            if (is_json) {
              continue
            }

            const s3_key = await s3VehicleAnalysisAnswerPut({
              analysis_type: item.analysis_type,
              bucket: S3_VEHICLE_ANALYSIS_ANSWER[WORKSPACE],
              vehicle_analysis_type: item.vehicle_analysis_type,
              vehicle_id: item.vehicle_id,
              request_id: item.request_id,
              s3_client: s3Client,
              body: analysis_info,
              third_party: item.third_party ? VehicleThirdPartyEnum.TECHMIZE : undefined,
              region: item.region,
            })

            const update = updateVehicle({
              request_id: item.request_id,
              vehicle_id: item.vehicle_id,
            }, {
              analysis_info: s3_key,
            },
            DYNAMO_TABLE_EAGLEREQUEST_FINISHED_ANALYSIS_VEHICLE[WORKSPACE],
            )

            vehicle_update_analysis.push(update)
          }
        }
      }
    } while (last_evaluated_key)

    logger.debug({
      message: 'Updating person',
      length: person_update_analysis.length,
    })

    for (const update of splitEvery(25, person_update_analysis)) {
      if (update.length >= 1) {
        const command = new TransactWriteCommand({
          TransactItems: update,
        })

        await dynamodbClient.send(command)

        await sleep(200)
      }
    }

    logger.debug({
      message: 'Updating vehicle',
      length: vehicle_update_analysis.length,
    })

    for (const update of splitEvery(25, vehicle_update_analysis)) {
      if (update.length >= 1) {
        const command = new TransactWriteCommand({
          TransactItems: update,
        })

        await dynamodbClient.send(command)

        await sleep(200)
      }
    }

    return undefined
  } catch (e) {
    logger.error({
      message: 'Error on run send analysis info s3',
      error: e,
    })

    throw new ErrorHandler('Error on run send analysis info s3', 500, e as any)
  }
}

main().then(console.log).catch(console.log)
