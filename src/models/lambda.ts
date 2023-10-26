import { APIGatewayProxyEvent } from 'aws-lambda'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'

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
