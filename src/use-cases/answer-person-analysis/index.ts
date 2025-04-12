import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { PersonKey } from 'src/models/dynamo/person'
import { RequestStatusEnum } from 'src/models/dynamo/request-enum'
import { PersonRequest, PersonRequestKey } from 'src/models/dynamo/request-person'
import getPerson from 'src/services/aws/dynamo/analysis/person/get'
import putPerson from 'src/services/aws/dynamo/analysis/person/put'
import updatePerson from 'src/services/aws/dynamo/analysis/person/update'
import deleteRequestPerson from 'src/services/aws/dynamo/request/analysis/person/delete'
import getRequestPerson from 'src/services/aws/dynamo/request/analysis/person/get'
import putFinishedRequestPerson from 'src/services/aws/dynamo/request/finished/person/put'
import s3PersonAnalysisAnswerPut from 'src/services/aws/s3/person-analysis/answer/put'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import personConstructor from './person-constructor'
import updatePersonConstructor from './update-person-constructor'

export type UseCaseAnswerPersonAnalysisParams = {
  analysis_info?: string
  analysis_result: AnalysisResultEnum
  dynamodbClient: DynamoDBClient,
  from_db: boolean
  person_id: string
  request_id: string
  s3Client: S3Client
}

const useCaseAnswerPersonAnalysis = async ({
  analysis_info,
  analysis_result,
  dynamodbClient,
  from_db,
  person_id,
  request_id,
  s3Client,
}: UseCaseAnswerPersonAnalysisParams): Promise<void> => {
  const request_person_key: PersonRequestKey = {
    person_id,
    request_id,
  }

  const request_person = await getRequestPerson(request_person_key, dynamodbClient)

  if (!request_person) {
    logger.warn({
      message: 'Person not exist',
      person_id,
    })

    throw new ErrorHandler('Pessoa não existe', 404)
  }

  const {
    company_name,
    person_analysis_type,
    region_type,
    region,
    analysis_type,
  } = request_person

  let analysis_info_value = analysis_info

  if (!request_person.third_party) {
    analysis_info_value = await s3PersonAnalysisAnswerPut({
      analysis_type,
      body: JSON.stringify(analysis_info),
      person_analysis_type,
      person_id,
      region,
      request_id,
      s3_client: s3Client,
    })
  }

  const now = new Date().toISOString()

  const finished_request: PersonRequest = removeEmpty({
    ...request_person,
    finished_at: now,
    status: RequestStatusEnum.FINISHED,
    analysis_info: analysis_info_value,
    analysis_result,
    from_db,
  })

  const finished_request_key: PersonRequestKey = {
    person_id,
    request_id,
  }

  const get_person_key: PersonKey = {
    person_id: request_person.person_id,
    document: request_person.document,
  }

  const person = await getPerson(get_person_key, dynamodbClient)

  const isApproved = analysis_result === AnalysisResultEnum.APPROVED

  if (person) {
    const person_constructor = updatePersonConstructor({
      company_name,
      isApproved,
      now,
      person,
      person_analysis_type,
      region_type,
      request_person,
      analysis_info,
      region,
    })

    const { person_id, document, ...person_body } = person_constructor

    const person_key: PersonKey = {
      person_id,
      document,
    }

    await putFinishedRequestPerson(
      finished_request_key,
      finished_request,
      dynamodbClient,
    )

    await updatePerson(
      person_key,
      person_body,
      dynamodbClient,
    )

    const person_request_key: PersonRequestKey = {
      request_id: request_person.request_id,
      person_id: request_person.person_id,
    }

    await deleteRequestPerson(
      person_request_key,
      dynamodbClient,
    )

    return
  }

  const person_constructor = personConstructor({
    analysis_info,
    company_name,
    isApproved,
    now,
    person_analysis_type,
    region_type,
    request_person,
    region,
  })

  const {
    person_id: person_id_constructor,
    document,
    ...person_body
  } = person_constructor

  const person_key: PersonKey = {
    person_id: person_id_constructor,
    document,
  }

  await putFinishedRequestPerson(
    finished_request_key,
    finished_request,
    dynamodbClient,
  )

  await putPerson(
    person_key,
    person_body,
    dynamodbClient,
  )

  const person_request_key: PersonRequestKey = {
    request_id: request_person.request_id,
    person_id: request_person.person_id,
  }

  await deleteRequestPerson(
    person_request_key,
    dynamodbClient,
  )
}

export default useCaseAnswerPersonAnalysis
