import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

export const createUpdateExpression = (
  data: object,
  removeKeys: string[] = [],
) => `set ${Object
  .keys(data)
  .filter((key) => !removeKeys.includes(key))
  .map((key) => `#${key}=:${key}`)
  .join(',')}`

export const createExpressionAttributeNames = (data: object): Record<string, string> | undefined => {
  if (Object.keys(data).length === 0) {
    return undefined
  }

  return Object
    .keys(data)
    .reduce(
      (previous, current) => ({
        ...previous,
        [`#${current}`]: current,
      }),
      {},
    )
}

export const createExpressionAttributeValues = (data: any, update?: boolean): Record<string, AttributeValue> | undefined => {
  if (Object.keys(data).length === 0) {
    return undefined
  }

  if (update === true) {
    return Object
      .keys(data)
      .reduce(
        (previous, current) => ({
          ...previous,
          [`:${current}`]: data[current],
        }),
        {},
      )
  }

  return Object
    .keys(data)
    .reduce(
      (previous, current) => ({
        ...previous,
        [`:${current}`]: marshall(data[current]),
      }),
      {},
    )
}

export const createConditionExpression = (
  data: object,
  exists: boolean,
) => {
  if (Object.keys(data).length === 0) {
    return undefined
  }

  return Object
    .keys(data)
    .map((key) => `#${key}${exists ? '=' : '<>'}:${key}`)
    .join(' AND ')
}
