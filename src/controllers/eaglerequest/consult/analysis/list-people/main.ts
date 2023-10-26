import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PersonRequest } from 'src/models/dynamo/request-person'
import { ReturnResponse } from 'src/models/lambda'
import scanPeople, { ScanPeopleRequest, ScanPeopleResponse } from 'src/services/aws/dynamo/request/analysis/person/scan'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const listPeopleController = async (user_info: UserInfoFromJwt): Promise<ReturnResponse<any>> => {
  let last_evaluated_key
  const scan: ScanPeopleRequest = {}
  const people: PersonRequest[] = []

  if (user_info.user_type === 'client') {
    scan.company_name = user_info.company_name
  }

  do {
    const query_result: ScanPeopleResponse | undefined = await scanPeople(
      scan,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!query_result) {
      logger.info({
        message: 'Finish on get people request info',
      })

      return {
        body: {
          message: 'Finish on query analysis people',
          people,
        },
      }
    }

    if (query_result?.result) {
      for (const item of query_result.result) {
        people.push(item)
      }
    }

    last_evaluated_key = query_result.last_evaluated_key
  } while (last_evaluated_key)

  people.sort(
    (r1, r2) => r1.created_at > r2.created_at
      ? 1
      : r1.created_at < r2.created_at
        ? -1
        : 0,
  )

  logger.info({
    message: 'Finish on get people request info',
  })

  return {
    body: {
      message: 'Finish on query analysis people',
      people,
    },
  }
}

export default listPeopleController
