import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { User } from 'src/models/dynamo/user'
import queryByEmail, { QueryByEmailQuery } from 'src/services/aws/dynamo/user/user/query-by-email'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const getUserByEmailAdapter = async (
  email: string,
  dynamodbClient: DynamoDBClient,
): Promise<User> => {
  const query: QueryByEmailQuery = {
    email,
  }

  const user = await queryByEmail(query, dynamodbClient)

  if (!user || !user[0]) {
    logger.warn({
      message: 'User not found',
      email,
    })

    throw new ErrorHandler('Usuário não encontrado', 404)
  }

  return user[0]
}

export default getUserByEmailAdapter
