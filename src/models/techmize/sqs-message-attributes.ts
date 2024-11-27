import { MessageAttributeValue } from '@aws-sdk/client-sns'
import { SQSMessageAttribute } from 'aws-lambda'

export enum TechimzePersonSQSMessageAttributesKeys {
  PERSON_ID = 'person_id',
  REQUEST_ID = 'request_id',
}

export type TechimzePersonSQSSendMessageAttributes = {
  [Key in TechimzePersonSQSMessageAttributesKeys]: MessageAttributeValue
}

export type TechimzePersonSQSReceivedMessageAttributes = {
  [Key in TechimzePersonSQSMessageAttributesKeys]: SQSMessageAttribute
}

export enum TechimzeVehicleSQSMessageAttributesKeys {
  REQUEST_ID = 'request_id',
  VEHICLE_ID = 'vehicle_id',
}

export type TechimzeVehicleSQSSendMessageAttributes = {
  [Key in TechimzeVehicleSQSMessageAttributesKeys]: MessageAttributeValue
}

export type TechimzeVehicleSQSReceivedMessageAttributes = {
  [Key in TechimzeVehicleSQSMessageAttributesKeys]: SQSMessageAttribute
}
