import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import useCaseAnswerPersonAnalysis, { UseCaseAnswerPersonAnalysisParams } from 'src/use-cases/answer-person-analysis'
import useCaseAnswerVehicleAnalysis, { UseCaseAnswerVehicleAnalysisParams } from 'src/use-cases/answer-vehicle-analysis'
import logger from 'src/utils/logger'

import validateBody from './validate-body'
import validatePath from './validate-path'
import validateQueryPerson from './validate-query-person'
import validateQueryVehicle from './validate-query-vehicle'

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
})

const s3Client = new S3Client({
  region: 'us-east-1',
  maxAttempts: 5,
})

const sendAnswerController = async (
  event: APIGatewayProxyEvent,
): Promise<ReturnResponse<any>> => {
  const { analysis_result, analysis_info, from_db } = validateBody(JSON.parse(event.body as string))
  const { analysis_type, id } = validatePath({ ...event.pathParameters })

  if (analysis_type === 'person') {
    const { person_id } = validateQueryPerson({ ...event.queryStringParameters })

    const data: UseCaseAnswerPersonAnalysisParams = {
      analysis_info,
      analysis_result,
      dynamodbClient,
      from_db,
      person_id,
      request_id: id,
      s3Client,
    }

    await useCaseAnswerPersonAnalysis(data)

    logger.info({
      message: 'Answer registered successfully',
      person_id: data.person_id,
    })

    return {
      body: {
        message: 'Answer registered successfully',
        person_id: data.person_id,
      },
    }
  }
  const { vehicle_id } = validateQueryVehicle({ ...event.queryStringParameters })

  const data: UseCaseAnswerVehicleAnalysisParams = {
    analysis_info,
    analysis_result,
    dynamodbClient,
    from_db,
    request_id: id,
    s3Client,
    vehicle_id,
  }

  await useCaseAnswerVehicleAnalysis(data)

  logger.info({
    message: 'Answer registered successfully',
    vehicle_id: data.vehicle_id,
  })

  return {
    body: {
      message: 'Answer registered successfully',
      vehicle_id: data.vehicle_id,
    },
  }
}

export default sendAnswerController
