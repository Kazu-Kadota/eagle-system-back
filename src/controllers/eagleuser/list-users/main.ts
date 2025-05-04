import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { User, UserGroupEnum } from 'src/models/dynamo/user'
import { Controller } from 'src/models/lambda'
import scanUser, { ScanUserResponse } from 'src/services/aws/dynamo/user/user/scan'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'
import { Exact } from 'src/utils/types/exact'

import validateBodyListUsers from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

export type UserSanitized = Omit<User, 'password'>

export type ListUsersParam = {
  user_type_filter?: Array<UserGroupEnum>
}

const listUsers: Controller = async (req) => {
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const { user_type_filter } = validateBodyListUsers(event_body)

  let last_evaluated_key
  const result: UserSanitized[] = []

  do {
    const scan: ScanUserResponse | undefined = await scanUser(
      dynamodbClient,
      last_evaluated_key,
    )

    if (!scan) {
      logger.info({
        message: 'Finish on scan user',
        users: result,
      })

      return {
        body: {
          message: 'Finish on scan user',
          users: result,
        },
      }
    }

    if (scan.result) {
      for (const item of scan.result) {
        if (!user_type_filter || (user_type_filter && user_type_filter.includes(item.user_type))) {
          const { password, ...rest_item } = item

          const user_sanitized: Exact<UserSanitized, typeof rest_item> = rest_item

          result.push(user_sanitized)
        }
      }
    }

    last_evaluated_key = scan.last_evaluated_key
  } while (last_evaluated_key)

  result.sort(
    (r1, r2) => r1.created_at > r2.created_at
      ? 1
      : r1.created_at < r2.created_at
        ? -1
        : 0,
  )

  logger.info({
    message: 'Finish on list users',
    users: result,
  })

  return {
    body: {
      message: 'Finish on list users',
      users: result,
    },
  }
}

export default listUsers
