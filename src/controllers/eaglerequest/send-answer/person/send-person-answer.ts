import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
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
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import personConstructor from './person-constructor'
import updatePersonConstructor from './update-person-constructor'

export interface SendPersonAnswer {
  request_id: string
  analysis_info?: string
  analysis_result: AnalysisResultEnum
  person_id: string
}

const sendPersonAnswer = async (
  data: SendPersonAnswer,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  const {
    request_id,
    analysis_info,
    analysis_result,
    person_id,
  } = data

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
  } = request_person

  const now = new Date().toISOString()

  const finished_request: PersonRequest = removeEmpty({
    ...request_person,
    finished_at: now,
    status: RequestStatusEnum.FINISHED,
    analysis_info,
    analysis_result,
  })

  const finished_request_key: PersonRequestKey = {
    person_id,
    request_id,
  }

  await putFinishedRequestPerson(finished_request_key, finished_request, dynamodbClient)

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

    await updatePerson(person_key, person_body, dynamodbClient)

    const person_request_key: PersonRequestKey = {
      request_id: request_person.request_id,
      person_id: request_person.person_id,
    }

    await deleteRequestPerson(person_request_key, dynamodbClient)

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

  await putPerson(person_key, person_body, dynamodbClient)

  const person_request_key: PersonRequestKey = {
    request_id: request_person.request_id,
    person_id: request_person.person_id,
  }

  await deleteRequestPerson(person_request_key, dynamodbClient)
}

export default sendPersonAnswer
