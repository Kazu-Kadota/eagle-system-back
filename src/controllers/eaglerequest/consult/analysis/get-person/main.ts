import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { PersonRequestKey } from 'src/models/dynamo/request-person'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { ReturnResponse } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

import getRequestPersonAdapter from './get-person-adapter'
import getS3AnalysisInfoAdapter, { GetS3AnalysisInfoAdapterParams } from './get-s3-analysis-info-adapter'
import validatePersonParam from './validate-param'
import validatePersonQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
})

const s3Client = new S3Client({
  region: 'us-east-1',
})

const getPersonByRequestIdController = async (
  event: APIGatewayProxyEvent,
  user_info: UserInfoFromJwt,
): Promise<ReturnResponse<any>> => {
  const { person_id } = validatePersonParam({ ...event.pathParameters })
  const { request_id } = validatePersonQuery({ ...event.queryStringParameters })

  const request_person_key: PersonRequestKey = {
    person_id,
    request_id,
  }

  const request_person = await getRequestPersonAdapter(request_person_key, user_info, dynamodbClient)

  if (request_person.finished_at) {
    // Is temporary
    const is_s3_path = request_person.analysis_info?.split('.')[1] === 'json'

    if (is_s3_path) {
      const get_s3_analysis_info_params: GetS3AnalysisInfoAdapterParams = {
        analysis_info: request_person.analysis_info as string,
        s3_client: s3Client,
        third_party: !!request_person.third_party,
      }

      const analysis_info = await getS3AnalysisInfoAdapter(get_s3_analysis_info_params)

      request_person.analysis_info = analysis_info
    }
  }

  if (user_info.user_type === UserGroupEnum.CLIENT) {
    delete request_person.third_party
  }

  logger.info({
    message: 'Finish on get person request info',
    request_id,
    person_id,
  })

  return {
    body: {
      message: 'Finish on get request person',
      person: request_person,
    },
  }
}

export default getPersonByRequestIdController
