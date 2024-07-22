import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AnalysisTypeEnum, PersonAnalysisTypeEnum, PersonRegionTypeEnum, RequestStatusEnum, StateEnum } from 'src/models/dynamo/request-enum'
import { PersonRequestKey, PersonRequestForms, PersonRequestBody } from 'src/models/dynamo/request-person'
import queryPersonByDocument from 'src/services/aws/dynamo/analysis/person/query-by-document'
import putRequestPerson from 'src/services/aws/dynamo/request/analysis/person/put'
import queryRequestPersonByDocument, { QueryRequestPersonByDocumentQuery } from 'src/services/aws/dynamo/request/analysis/person/query-by-document'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'
import { v4 as uuid } from 'uuid'

export interface PersonAnalysisResponse {
  analysis_type: AnalysisTypeEnum
  name: string
  person_id: string
  person_analysis_type: PersonAnalysisTypeEnum
  region_type?: PersonRegionTypeEnum,
  region?: StateEnum,
  request_id: string
}

export interface PersonAnalysisRequest {
  analysis_type: AnalysisTypeEnum
  combo_id?: string
  combo_number?: number
  dynamodbClient: DynamoDBClient
  person_analysis_type: PersonAnalysisTypeEnum
  person_data: PersonRequestForms
  region_type?: PersonRegionTypeEnum,
  region?: StateEnum,
  user_info: UserInfoFromJwt
}

const personAnalysis = async (
  {
    analysis_type,
    combo_id,
    combo_number,
    dynamodbClient,
    person_analysis_type,
    person_data,
    region_type,
    region,
    user_info,
  }: PersonAnalysisRequest,
): Promise<PersonAnalysisResponse> => {
  logger.debug({
    message: 'Requested person analysis',
    analysis_type,
    company_name: user_info.company_name,
    user_id: user_info.user_id,
  })

  const request_id = uuid()

  const person_analysis_people = await queryPersonByDocument(person_data.document, dynamodbClient)

  const query: QueryRequestPersonByDocumentQuery = {
    document: person_data.document,
  }

  const requested_person = await queryRequestPersonByDocument(
    query,
    dynamodbClient,
  )

  let person_id: string

  if (person_analysis_people && person_analysis_people[0]) {
    person_id = person_analysis_people[0].person_id
  } else if (requested_person && requested_person[0]) {
    person_id = requested_person[0].person_id
  } else {
    person_id = uuid()
  }

  const data_request_person: PersonRequestBody = {
    ...person_data,
    region,
    region_type,
    analysis_type,
    person_analysis_type,
    combo_id,
    combo_number: combo_number || undefined,
    company_name: user_info.user_type === 'admin' ? person_data.company_name as string : user_info.company_name,
    user_id: user_info.user_id,
    status: RequestStatusEnum.WAITING,
  }

  const request_person_person_data = removeEmpty(data_request_person)

  const request_person_key: PersonRequestKey = {
    person_id,
    request_id,
  }

  await putRequestPerson(request_person_key, request_person_person_data, dynamodbClient)

  logger.info({
    message: 'Successfully requested to analyze person',
    person_id,
    request_id,
    name: person_data.name,
    company_name: user_info.company_name,
    user_id: user_info.user_id,
  })

  return {
    analysis_type,
    name: person_data.name,
    person_id,
    person_analysis_type,
    region_type,
    region,
    request_id,
  }
}

export default personAnalysis
