import { SFNClient } from '@aws-sdk/client-sfn'
import { APIGatewayProxyEvent, SQSMessageAttribute, SQSMessageAttributes, SQSRecordAttributes } from 'aws-lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'

import { TechmizeV2GetRequestProcessingResponse } from './techmize/v2/get-response-error'

export interface ReturnResponse<T> {
  body: T
}

export interface Response<T = any> extends ReturnResponse<T> {
  headers?:
  | {
        [header: string]: boolean | number | string;
    }
  | undefined;
  multiValueHeaders?:
  | {
        [header: string]: Array<boolean | number | string>;
    }
  | undefined;
  statusCode?: number
  isBase64Encoded?: boolean | undefined
  notJsonBody?: boolean
}

export interface Request extends APIGatewayProxyEvent {
  user_info?: UserInfoFromJwt
}

export type Controller<T = any> = (req: Request) => Promise<Response<T>>

export type SQSControllerMessageAttributes = {
  origin: SQSMessageAttribute,
  requestId: SQSMessageAttribute,
}

export type SQSControllerMessage<T = SQSMessageAttributes> = {
  attributes: SQSRecordAttributes
  body: unknown
  message_attributes: T & SQSControllerMessageAttributes
  message_id: string
}

export type SQSControllerResponse = {
  success: true,
  statusCode: 200,
} | {
  success: false,
  statusCode: number,
  error: any,
}

export type SQSController<T = SQSMessageAttributes> = (message: SQSControllerMessage<T>) => Promise<SQSControllerResponse>

export type SQSStepFunctionControllerParams<T> = SQSControllerMessage<T> & Partial<TechmizeV2GetRequestProcessingResponse> & {
  taskToken: string
  sfnClient: SFNClient
}

export type SQSStepFunctionController<T = SQSMessageAttributes, R = SQSControllerResponse> = (message: SQSStepFunctionControllerParams<T>) => Promise<R>
