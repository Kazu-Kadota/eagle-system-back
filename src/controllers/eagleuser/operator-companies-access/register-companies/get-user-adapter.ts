import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { User, UserKey } from 'src/models/dynamo/user'
import getUser from 'src/services/aws/dynamo/user/user/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const getUserAdapter = async (
  key: UserKey,
  dynamodbClient: DynamoDBClient,
): Promise<User> => {
  const user = await getUser(key, dynamodbClient)

  if (!user) {
    logger.warn({
      message: 'User not exist',
      ...key,
    })

    throw new ErrorHandler('Pessoa não existe', 404)
  }

  return user
}

export default getUserAdapter
