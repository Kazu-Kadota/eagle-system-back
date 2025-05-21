import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SynthesisReport } from 'src/models/dynamo/request-synthesis'
import queryRequestSynthesisByCompany, { QueryRequestSynthesisByCompany, QueryRequestSynthesisByCompanyResponse } from 'src/services/aws/dynamo/request/synthesis/query-by-company'
import { Exact } from 'src/utils/types/exact'

export type SynthesisReportResponse = {
  result: SynthesisReport[]
  count: number
}

const synthesisReport = async (
  data: QueryRequestSynthesisByCompany,
  dynamodbClient: DynamoDBClient,
): Promise<SynthesisReportResponse> => {
  const result: Array<SynthesisReport> = []
  let last_evaluated_key
  let count: number = 0

  do {
    const query_waiting_processing_result: QueryRequestSynthesisByCompanyResponse | undefined = await queryRequestSynthesisByCompany({
      data,
      dynamodbClient,
      last_evaluated_key,
    })

    if (!query_waiting_processing_result) {
      break
    }

    for (const item of query_waiting_processing_result.result) {
      const {
        analysis_type,
        document,
        person_id,
        person_request_id,
        status,
        text_input,
        text_output,
        third_party,
        user_id,
        vehicle_id,
        vehicle_request_id,
        ...synthesis_report
      } = item

      const synthesis: Exact<SynthesisReport, typeof synthesis_report> = synthesis_report

      result.push(synthesis)
    }

    count += query_waiting_processing_result.count

    last_evaluated_key = query_waiting_processing_result?.last_evaluated_key
  } while (last_evaluated_key)

  return {
    result,
    count,
  }
}

export default synthesisReport
