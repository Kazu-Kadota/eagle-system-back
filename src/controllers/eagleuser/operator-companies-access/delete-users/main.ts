import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Controller } from 'src/models/lambda'
import transactWriteOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/transact-write'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

import validateBodyOperatorCompaniesAccessDeleteUsers from './validate-body'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const operatorCompaniesAccessDeleteUsersController: Controller = async (req) => {
  const event_body = removeEmpty(JSON.parse(req.body as string))

  const body = validateBodyOperatorCompaniesAccessDeleteUsers(event_body)

  await transactWriteOperatorCompaniesAccess({
    dynamodbClient,
    operation: 'delete',
    operators: body.user_ids.map((item) => {
      return {
        user_id: item,
      }
    }),
  })

  logger.info({
    message: 'Successfully deleted operators companies access',
    user_ids: body,
  })

  return {
    body: {
      message: 'Successfully deleted operators companies access',
      user_ids: body,
    },
  }
}

export default operatorCompaniesAccessDeleteUsersController
