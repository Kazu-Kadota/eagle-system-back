export interface Statement {
  Action: string
  Effect: string
  Resource: string
}

export interface PolicyDocument {
  Version: string
  Statement: Statement[]
}

export interface Iam {
  principalId: string,
  policyDocument: PolicyDocument
  context: any
}
