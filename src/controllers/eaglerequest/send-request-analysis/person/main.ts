import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { Controller } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import removeEmpty from 'src/utils/remove-empty'

import personAnalysisConstructor, { PersonAnalysisConstructor } from './person_analysis_constructor'
import validateBodyPerson from './validate-body-person'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const requestAnalysisPerson: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyPerson(event_body)

  const person_analyzes = []

  for (const person_analysis of body.person_analysis) {
    const person_analysis_request: PersonAnalysisConstructor = {
      analysis_type: AnalysisTypeEnum.PERSON,
      person_data: body.person,
      dynamodbClient,
      user_info,
    }

    person_analyzes.push(await personAnalysisConstructor(person_analysis, person_analysis_request))
  }

  return {
    body: {
      message: 'Successfully requested to analyze person',
      person_analyzes: person_analyzes.flat(),
    },
  }
}

export default requestAnalysisPerson
