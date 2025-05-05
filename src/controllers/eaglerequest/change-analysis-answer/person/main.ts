import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { PersonThirdPartyEnum } from 'src/models/dynamo/request-enum'
import { PersonRequestKey } from 'src/models/dynamo/request-person'
import { Controller } from 'src/models/lambda'
import updateFinishedRequestPerson from 'src/services/aws/dynamo/request/finished/person/update'
import s3PersonAnalysisAnswerPut from 'src/services/aws/s3/person-analysis/answer/put'
import s3PersonAnalysisAnswerThirdPartyPut from 'src/services/aws/s3/person-analysis/answer/third-party/put'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import getFinishedPersonAdapter from './get-finished-person-adapter'
import validateBodyChangeAnalysisAnswerPerson from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const s3Client = new S3Client({
  region: 'us-east-1',
  maxAttempts: 5,
})

const changeAnalysisAnswerPersonController: Controller = async (req) => {
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyChangeAnalysisAnswerPerson(event_body)

  const person_key: PersonRequestKey = {
    person_id: body.person_id,
    request_id: body.request_id,
  }

  const finished_person = await getFinishedPersonAdapter(person_key, dynamodbClient)

  if (finished_person.third_party) {
    await s3PersonAnalysisAnswerThirdPartyPut({
      // Do the next change in the future. Vehicle too
      // third_party: Object.keys(finished_person.third_party)[0] as PersonThirdPartyEnum,
      third_party: PersonThirdPartyEnum.TECHMIZE,
      analysis_type: finished_person.analysis_type,
      body: JSON.stringify(body.analysis_info),
      person_analysis_type: finished_person.person_analysis_type,
      person_id: finished_person.person_id,
      region: finished_person.region,
      request_id: finished_person.request_id,
      s3_client: s3Client,
    })
  } else {
    await s3PersonAnalysisAnswerPut({
      analysis_type: finished_person.analysis_type,
      body: JSON.stringify(body.analysis_info),
      person_analysis_type: finished_person.person_analysis_type,
      person_id: finished_person.person_id,
      region: finished_person.region,
      request_id: finished_person.request_id,
      s3_client: s3Client,
    })
  }

  await updateFinishedRequestPerson(
    person_key,
    {
      analysis_result: body.analysis_result,
      from_db: body.from_db,
    },
    dynamodbClient,
  )

  logger.info({
    message: 'Successfully changed person`s analysis answer',
    person_id: finished_person.person_id,
    request_id: finished_person.request_id,
  })

  return {
    body: {
      message: 'Successfully changed person`s analysis answer',
      person_id: finished_person.person_id,
      request_id: finished_person.request_id,
    },
  }
}

export default changeAnalysisAnswerPersonController
