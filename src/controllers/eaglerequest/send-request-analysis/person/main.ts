import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SNSClient } from '@aws-sdk/client-sns'
import { AnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { Controller } from 'src/models/lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import removeEmpty from 'src/utils/remove-empty'

import getCompanyByNameAdapter from './get-company-adapter'
import personAnalysisConstructor, { PersonAnalysisConstructor } from './person_analysis_constructor'
import validateBodyPerson from './validate-body-person'
import verifyAllowanceWithFeatureFlag, { VerifyAllowanceWithFeatureFlagParams } from './verify-allowance-with-feature-flag'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const snsClient = new SNSClient({
  region: 'us-east-1',
  maxAttempts: 5,
})

const requestAnalysisPerson: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyPerson(event_body)

  const person_analyzes = []

  let company_name = user_info.company_name

  if (user_info.user_type === 'admin') {
    company_name = body.person.company_name as string
  }

  const company = await getCompanyByNameAdapter(company_name, dynamodbClient)

  const verify_allowance_with_feature_flag_params: VerifyAllowanceWithFeatureFlagParams = {
    company_id: company.company_id,
    dynamodbClient,
    person_analysis: body.person_analysis,
  }

  await verifyAllowanceWithFeatureFlag(verify_allowance_with_feature_flag_params)

  for (const person_analysis of body.person_analysis) {
    const person_analysis_request: PersonAnalysisConstructor = {
      analysis_type: AnalysisTypeEnum.PERSON,
      person_data: body.person,
      dynamodbClient,
      snsClient,
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
