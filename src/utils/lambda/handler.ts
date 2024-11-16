import { SFNClient } from '@aws-sdk/client-sfn'
import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent, SQSMessageAttributes } from 'aws-lambda'

import { defaultHeaders } from 'src/constants/headers'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { Controller, Request, SQSController, SQSControllerMessageAttributes, SQSStepFunctionController } from 'src/models/lambda'

import catchError, { catchErrorSQSStepFunction } from '../catch-error'
import ErrorHandler from '../error-handler'
import extractJwtLambda from '../extract-jwt-lambda'
import logger from '../logger'

namespace LambdaHandlerNameSpace {
  export interface UserAuthentication extends Record<UserGroupEnum, boolean> {}

  export class LambdaHandlerFunction {
    controller: Controller
    authentication?: UserAuthentication

    constructor (controller: Controller, authentication?: UserAuthentication) {
      this.controller = controller
      this.authentication = authentication
    }

    async handler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
      try {
        logger.setRequestId(event.requestContext.requestId)

        const request: Request = {
          ...event,
        }

        if (this.authentication) {
          const user_info = extractJwtLambda(event)

          if (!user_info) {
            logger.error({
              message: 'User not authenticated',
            })

            throw new ErrorHandler('Usuário não autenticado', 403)
          }

          logger.setUser(user_info?.user_id)

          if (!this.authentication[user_info.user_type]) {
            logger.error({
              message: 'User not authorized to execute this function',
              user_type: user_info.user_type,
            })

            throw new ErrorHandler('Usuário não autorizado para executar este fluxo', 401)
          }

          request.user_info = user_info
        }

        const result = await this.controller(request)

        return {
          headers: {
            ...defaultHeaders,
            ...result.headers,
          },
          multiValueHeaders: result.multiValueHeaders,
          statusCode: result.statusCode ?? 200,
          body: result.notJsonBody === true ? result.body : JSON.stringify(result.body),
          isBase64Encoded: result.isBase64Encoded,
        }
      } catch (err: any) {
        return catchError(err)
      }
    }
  }

  export class LambdaStepFunctionFromSQSHandlerFunction<T = SQSMessageAttributes> {
    controller: SQSStepFunctionController<T>

    sfnClient = new SFNClient({
      region: 'us-east-1',
      maxAttempts: 5,
    })

    task_token: string = ''

    constructor (controller: SQSStepFunctionController<T>) {
      this.controller = controller
    }

    async handler (event: SQSEvent & { taskToken: string }): Promise<void> {
      try {
        logger.debug({
          event,
        })

        this.task_token = event.taskToken

        for (const record of event.Records) {
          const message_attributes = record.messageAttributes as T & SQSControllerMessageAttributes

          if (!message_attributes.requestId?.stringValue) {
            logger.error({
              message: 'Lambda requestId is not set from message sender',
            })

            throw new ErrorHandler('Lambda requestId is not set from message sender', 500)
          }

          if (!message_attributes.origin?.stringValue) {
            logger.error({
              message: 'Lambda origin is not set from message sender',
            })

            throw new ErrorHandler('Lambda origin is not set from message sender', 500)
          }

          logger.setRequestId(message_attributes.requestId.stringValue)

          logger.debug({
            message: 'SFN FROM SQS: Handling message',
          })

          await this.controller({
            attributes: record.attributes,
            body: JSON.parse(record.body) as unknown,
            message_attributes,
            message_id: record.messageId,
            taskToken: this.task_token,
            sfnClient: this.sfnClient,
          })
        }
      } catch (err) {
        await catchErrorSQSStepFunction({
          err,
          sfnClient: this.sfnClient,
          task_token: this.task_token,
        })
      }
    }
  }
  export class LambdaSQSHandlerFunction<T = SQSMessageAttributes> {
    controller: SQSController<T>

    constructor (controller: SQSController<T>) {
      this.controller = controller
    }

    async handler (event: SQSEvent): Promise<void> {
      for (const record of event.Records) {
        const message_attributes = record.messageAttributes as T & SQSControllerMessageAttributes

        if (!message_attributes.requestId?.stringValue) {
          logger.error({
            message: 'Lambda requestId is not set from message sender',
          })

          throw new ErrorHandler('Lambda requestId is not set from message sender', 500)
        }

        if (!message_attributes.origin?.stringValue) {
          logger.error({
            message: 'Lambda origin is not set from message sender',
          })

          throw new ErrorHandler('Lambda origin is not set from message sender', 500)
        }

        logger.setRequestId(message_attributes.requestId.stringValue)

        logger.debug({
          message: 'SQS-LAMBDA: Handling message',
        })

        await this.controller({
          attributes: record.attributes,
          body: JSON.parse(record.body) as unknown,
          message_attributes,
          message_id: record.messageId,
        })
      }
    }
  }
}

export default LambdaHandlerNameSpace
