import { TechmizeV1AuthenticationErrorResponse, TechmizeV1GenericErrorResponse } from '../error'

export type TechmizeV1ConsultarProcessosResponseDecisions = {
  DecisionContent: string
  DecisionDate: string
}

export type TechmizeV1ConsultarProcessosResponsePetitions = {
  Type: string
  Author: string
  CreationDate: string
  JoinedDate: string
}

export type TechmizeV1ConsultarProcessosResponseUpdate = {
  Content: string
  PublishDate: string
  CaptureDate: string
}

export type PartyDetails = {
  SpecificType: string
  OAB?: string
  State?: string
}

export type TechmizeV1ConsultarProcessosResponseParty = {
  Doc: string
  IsPartyActive: boolean
  Name: string
  Polarity: string
  Type: string
  IsInference: boolean
  PartyDetails: PartyDetails
  LastCaptureDate: string
}

export type TechmizeV1ConsultarProcessosResponseLawsuit = {
  Number: string
  Type: string
  MainSubject: string
  CourtName: string
  CourtLevel: string
  CourtType: string
  CourtDistrict: string
  JudgingBody: string
  State: string
  Status: string
  LawsuitHostService: string
  InferredCNJSubjectName: string
  InferredCNJSubjectNumber: number
  InferredCNJProcedureTypeName: string
  InferredCNJProcedureTypeNumber: number
  InferredBroadCNJSubjectName: string
  InferredBroadCNJSubjectNumber: number
  OtherSubjects: string[]
  NumberOfVolumes: number
  NumberOfPages: number
  Value: number
  ResJudicataDate: string
  CloseDate: string
  RedistributionDate: string
  PublicationDate: string
  NoticeDate: string
  LastMovementDate: string
  CaptureDate: string
  LastUpdate: string
  NumberOfParties: number
  NumberOfUpdates: number
  LawSuitAge: number
  AverageNumberOfUpdatesPerMonth: number
  ReasonForConcealedData: number
  Parties: TechmizeV1ConsultarProcessosResponseParty[]
  Updates: TechmizeV1ConsultarProcessosResponseUpdate[]
  Petitions: TechmizeV1ConsultarProcessosResponsePetitions[]
  Decisions: TechmizeV1ConsultarProcessosResponseDecisions[]
  dispositivo_legal: string
  artigo: string
  glossario: string
  cod_assunto_cnj: number
}

export type TechmizeV1ConsultarProcessosResponseDataDetails = {
  MatchKeys: string
  Processes: {
    Lawsuits: TechmizeV1ConsultarProcessosResponseLawsuit[]
  }
  TotalLawsuits: number
  TotalLawsuitsAsAuthor: number
  TotalLawsuitsAsDefendant: number
  TotalLawsuitsAsOther: number
  FirstLawsuitDate: string
  LastLawsuitDate: string
  Last30DaysLawsuits: number
  Last90DaysLawsuits: number
  Last180DaysLawsuits: number
  Last365DaysLawsuits: number
}

export type TechmizeV1ConsultarProcessosResponseData = {
  processos: TechmizeV1ConsultarProcessosResponseDataDetails[]
}

export type TechmizeV1ConsultarProcessosResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV1ConsultarProcessosResponseData
}

export type TechmizeV1ConsultarProcessosResponse = TechmizeV1GenericErrorResponse | TechmizeV1AuthenticationErrorResponse | TechmizeV1ConsultarProcessosResponseSuccess
