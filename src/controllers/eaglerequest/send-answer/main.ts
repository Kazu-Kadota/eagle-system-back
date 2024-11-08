import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import logger from 'src/utils/logger'

import useCaseAnswerPersonAnalysis, { UseCaseAnswerPersonAnalysisParams } from '../../../use-cases/answer-person-analysis'

import useCaseAnswerVehicleAnalysis from '../../../use-cases/answer-vehicle-analysis'

import validateBody from './validate-body'
import validatePath from './validate-path'
import validateQueryPerson from './validate-query-person'
import validateQueryVehicle from './validate-query-vehicle'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const sendAnswerController = async (
  event: APIGatewayProxyEvent,
): Promise<ReturnResponse<any>> => {
  const { analysis_result, analysis_info, from_db } = validateBody(JSON.parse(event.body as string))
  const { analysis_type, id } = validatePath({ ...event.pathParameters })

  if (analysis_type === 'person') {
    const { person_id } = validateQueryPerson({ ...event.queryStringParameters })

    const data: UseCaseAnswerPersonAnalysisParams = {
      request_id: id,
      analysis_result,
      analysis_info,
      from_db,
      person_id,
    }

    await useCaseAnswerPersonAnalysis(data, dynamodbClient)

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

  const data = {
    request_id: id,
    analysis_result,
    analysis_info,
    from_db,
    vehicle_id,
  }

  await useCaseAnswerVehicleAnalysis(data, dynamodbClient)

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
