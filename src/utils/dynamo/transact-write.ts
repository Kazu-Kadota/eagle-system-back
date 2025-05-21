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
      const now = new Date().toISOString()

      const item = {
        ...key,
        ...body,
        created_at: now,
        updated_at: now,
      }

      return {
        Put: {
          TableName: table,
          Item: item,
          ConditionExpression: createConditionExpression(key, false),
          ExpressionAttributeNames: createExpressionAttributeNames(key),
          ExpressionAttributeValues: createExpressionAttributeValues(key),
        },
      }
    }
    case 'update': {
      const now = new Date().toISOString()

      const item = {
        ...key,
        ...body,
        updated_at: now,
      }

      return {
        Update: {
          TableName: table,
          Key: key,
          ConditionExpression: createConditionExpression(key, true),
          ExpressionAttributeNames: createExpressionAttributeNames(item),
          ExpressionAttributeValues: createExpressionAttributeValues(item, true),
          UpdateExpression: createUpdateExpression(item, Object.keys(key)),
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
