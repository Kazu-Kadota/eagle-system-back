export type TechmizeV2ConsultarProcessosResponseDecisions = {
  DecisionContent: string
  DecisionDate: string
}

export type TechmizeV2ConsultarProcessosResponsePetitions = {
  Type: string
  Author: string
  CreationDate: string
  JoinedDate: string
}

export type TechmizeV2ConsultarProcessosResponseUpdate = {
  Content: string
  PublishDate: string
  CaptureDate: string
}

export type PartyDetails = {
  SpecificType: string
  OAB?: string
  State?: string
}

export type TechmizeV2ConsultarProcessosResponseParty = {
  Doc: string
  IsPartyActive: boolean
  Name: string
  Polarity: string
  Type: string
  IsInference?: boolean
  PartyDetails: PartyDetails
  LastCaptureDate: string
}

export type TechmizeV2ConsultarProcessosResponseLawsuit = {
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
  InferredCNJProcedureTypeName?: string
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
  Parties: TechmizeV2ConsultarProcessosResponseParty[]
  Updates: TechmizeV2ConsultarProcessosResponseUpdate[]
  Petitions: TechmizeV2ConsultarProcessosResponsePetitions[]
  Decisions: TechmizeV2ConsultarProcessosResponseDecisions[]
  dispositivo_legal: string
  artigo: string
  glossario: string
  cod_assunto_cnj: number
}

export type TechmizeV2ConsultarProcessosResponseDataDetails = {
  MatchKeys: string
  Processes: {
    Lawsuits: TechmizeV2ConsultarProcessosResponseLawsuit[]
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

export type TechmizeV2ConsultarProcessosResponseData = {
  processos?: TechmizeV2ConsultarProcessosResponseDataDetails[]
  processos_judiciais_administrativos: TechmizeV2ConsultarProcessosResponseDataDetails[][]
}

export type TechmizeV2ConsultarProcessosResponseSuccess = {
  code: 1
  message: string
  data: TechmizeV2ConsultarProcessosResponseData
  status_request: string
}
