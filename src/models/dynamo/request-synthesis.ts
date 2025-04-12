import { AnalysisTypeEnum, RequestStatusEnum, SynthesisThirdPartyEnum } from './request-enum'
import { Timestamp } from './timestamp'

export type SynthesisRequestParams = {
  company_name: string
  person_id?: string
  person_request_id?: string
  text: string
  vehicle_id?: string
  vehicle_request_id?: string
}

export type SyntheisRequestReceiveMetadata = {
  request_id: string
  synthesis_id: string
  person_id?: string
  person_request_id?: string
  vehicle_id?: string
  vehicle_request_id?: string
}

export type SyntheisRequestReceiveParams = {
  metadata: SyntheisRequestReceiveMetadata
  texto: string // gzip base64
}

export type SynthesisRequestThirdParty = {
  company: SynthesisThirdPartyEnum
  data: any
}

export type SynthesisRequestKey = {
  request_id: string
  synthesis_id: string
}

export type SynthesisRequestBody = {
  analysis_type: AnalysisTypeEnum.SYNTHESIS
  company_name: string
  person_id?: string
  person_request_id?: string
  status: RequestStatusEnum
  text_input: string // S3 Path
  text_output?: string // S3 Path
  third_party?: SynthesisRequestThirdParty
  user_id: string
  vehicle_id?: string
  vehicle_request_id?: string
}

export type SynthesisRequest = SynthesisRequestKey & SynthesisRequestBody & Timestamp & {}

export type SynthesisReport = Omit<SynthesisRequest,
  'analysis_type'
  | 'person_id'
  | 'person_request_id'
  | 'status'
  | 'text_input'
  | 'text_output'
  | 'third_party'
  | 'user_id'
  | 'vehicle_id'
  | 'vehicle_request_id'
>

export type SynthesisReportSummary = {
  company_name: string
  count: number
}
