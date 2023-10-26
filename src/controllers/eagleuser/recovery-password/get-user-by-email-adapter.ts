import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { User } from 'src/models/dynamo/user'
import queryByEmail, { QueryByEmailQuery } from 'src/services/aws/dynamo/user/user/query-by-email'
import logger from 'src/utils/logger'

const queryUserByEmailAdapter = async (
  email: string,
  dynamodbClient: DynamoDBClient,
): Promise<User | undefined> => {
  const query: QueryByEmailQuery = {
    email,
  }

  const user = await queryByEmail(query, dynamodbClient)

  if (!user || !user[0]) {
    logger.warn({
      message: 'E-mail not found',
      email,
    })

    return undefined
  }

  return user[0]
}

export default queryUserByEmailAdapter
