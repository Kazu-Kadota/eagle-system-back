import ErrorHandler from '../error-handler'
import logger from '../logger'

import { createConditionExpression, createExpressionAttributeNames, createExpressionAttributeValues, createUpdateExpression } from './expression'

export const transactWriteOperatorsMap = {
  delete: 'Delete',
  put: 'Put',
  update: 'Update',
}

export type TransactWriteOperatorsMap = keyof typeof transactWriteOperatorsMap

export type TransactWriteItemsParams = {
  operation: TransactWriteOperatorsMap
  table: string
  key: object
  body: object
}

export const transactWriteItems = ({
  body,
  key,
  operation,
  table,
}: TransactWriteItemsParams) => {
  switch (operation) {
    case 'delete': {
      return {
        Delete: {
          TableName: table,
          Key: key,
        },
      }
    }
    case 'put': {
      return {
        Put: {
          TableName: table,
          Item: key,
          ExpressionAttributeNames: createExpressionAttributeNames(key),
          ExpressionAttributeValues: createExpressionAttributeValues(key),
          ConditionExpression: createConditionExpression(key, false),
        },
      }
    }
    case 'update': {
      return {
        Update: {
          TableName: table,
          Key: key,
          UpdateExpression: createUpdateExpression(body, Object.keys(key)),
          ExpressionAttributeNames: createExpressionAttributeNames(body),
          ExpressionAttributeValues: createExpressionAttributeValues(body, true),
          ConditionExpression: createConditionExpression(key, true),
        },
      }
    }
    default: {
      logger.error({
        message: 'TransactWrite operation not existent',
        operator: operation,
      })

      throw new ErrorHandler('Erro interno no servidor. Contatar o time técnico.', 500)
    }
  }
}
