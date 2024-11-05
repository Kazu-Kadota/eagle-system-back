import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ReturnResponse } from 'src/models/lambda'
import logger from 'src/utils/logger'

import answerPersonAnalysis, { AnswerPersonAnalysis } from '../../../use-cases/answer-person-analysis'
import validateQueryPerson from '../../../use-cases/answer-person-analysis/validate-query-person'

import sendVehicleAnswer from '../../../use-cases/answer-vehicle-analysis/send-vehicle-answer'

import validateQueryVehicle from '../../../use-cases/answer-vehicle-analysis/validate-query-vehicle'

import validateBody from './validate-body'
import validatePath from './validate-path'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const sendAnswerController = async (
  event: APIGatewayProxyEvent,
): Promise<ReturnResponse<any>> => {
  const { analysis_result, analysis_info, from_db } = validateBody(JSON.parse(event.body as string))
  const { analysis_type, id } = validatePath({ ...event.pathParameters })

  if (analysis_type === 'person') {
    const { person_id } = validateQueryPerson({ ...event.queryStringParameters })

    const data: AnswerPersonAnalysis = {
      request_id: id,
      analysis_result,
      analysis_info,
      from_db,
      person_id,
    }

    await answerPersonAnalysis(data, dynamodbClient)

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

  await sendVehicleAnswer(data, dynamodbClient)

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
