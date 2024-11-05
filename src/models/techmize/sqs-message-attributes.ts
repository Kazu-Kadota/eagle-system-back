import { MessageAttributeValue } from '@aws-sdk/client-sns'
import { SQSMessageAttribute } from 'aws-lambda'

export enum TechimzeSQSMessageAttributesKeys {
  PERSON_ID = 'person_id',
  REQUEST_ID = 'request_id',
}

export type TechimzeSQSSendMessageAttributes = {
  [Key in TechimzeSQSMessageAttributesKeys]: MessageAttributeValue
}

export type TechimzeSQSReceivedMessageAttributes = {
  [Key in TechimzeSQSMessageAttributesKeys]: SQSMessageAttribute
}
