import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { AnalysisTypeEnum } from 'src/models/dynamo/request-enum'
import { Controller } from 'src/models/lambda'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import getCompanyByNameAdapter from './get-company-adapter'
import requestSynthesis, { SynthesisAnalysisRequest } from './request-synthesis'
import validateBodySynthesis from './validate-body'
import verifyAllowanceToSynthesisWithFeatureFlag, { VerifyAllowanceToSynthesisWithFeatureFlagParams } from './verify-allowance-with-feature-flag'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const s3Client = new S3Client({
  region: 'us-east-1',
  maxAttempts: 5,
})

const requestSynthesisController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodySynthesis(event_body)

  if (user_info.user_type === 'admin' && !body.company_name) {
    logger.warn({
      message: 'Need to inform company name for admin user',
      user_type: user_info.user_type,
    })

    throw new ErrorHandler('É necessário informar o nome da empresa para usuários admin', 400)
  }

  const exist_only_one_person_id = (!body.person_id && body.person_request_id)
    || (body.person_id && !body.person_request_id)

  if (exist_only_one_person_id) {
    logger.warn({
      message: 'It is necessary inform person_id and person_request_id instead of one of them',
      person_id: body.person_id,
      person_request_id: body.person_request_id,
    })

    throw new ErrorHandler('Foi informado somente person_id ou person_request_id', 400, [{
      person_id: body.person_id,
      person_request_id: body.person_request_id,
    }])
  }

  const exist_only_one_vehicle_id = (!body.vehicle_id && body.vehicle_request_id)
    || (body.vehicle_id && !body.vehicle_request_id)

  if (exist_only_one_vehicle_id) {
    logger.warn({
      message: 'It is necessary inform vehicle_id and vehicle_request_id instead of one of them',
      vehicle_id: body.vehicle_id,
      vehicle_request_id: body.vehicle_request_id,
    })

    throw new ErrorHandler('Foi informado somente vehicle_id ou vehicle_request_id', 400, [{
      vehicle_id: body.vehicle_id,
      vehicle_request_id: body.vehicle_request_id,
    }])
  }

  const company_name = user_info.user_type === 'admin'
    ? body.company_name as string
    : user_info.company_name

  const company = await getCompanyByNameAdapter(company_name, dynamodbClient)

  const verify_allowance_with_feature_flag_params: VerifyAllowanceToSynthesisWithFeatureFlagParams = {
    company_id: company.company_id,
    dynamodbClient,
  }

  await verifyAllowanceToSynthesisWithFeatureFlag(verify_allowance_with_feature_flag_params)

  const synthesis_request: SynthesisAnalysisRequest = {
    analysis_type: AnalysisTypeEnum.SYNTHESIS,
    company_name,
    dynamodbClient,
    person_id: body.person_id,
    person_request_id: body.person_request_id,
    s3_client: s3Client,
    text: body.text,
    user_info,
    vehicle_id: body.vehicle_id,
    vehicle_request_id: body.vehicle_request_id,
  }

  const synthesis = await requestSynthesis(synthesis_request)

  logger.info({
    message: 'Successfully requested synthesis',
    ...synthesis,
    company_name: user_info.company_name,
    user_id: user_info.user_id,
  })

  return {
    body: {
      message: 'Successfully requested synthesis',
      ...synthesis,
    },
  }
}

export default requestSynthesisController
