import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PersonRequest } from 'src/models/dynamo/request-person'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { OperatorCompaniesAccess, OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'
import { Controller } from 'src/models/lambda'
import scanPeople, { ScanPeopleRequest, ScanPeopleResponse } from 'src/services/aws/dynamo/request/analysis/person/scan'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'
import memorySizeOf from 'src/utils/memory-size-of'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const listPeopleController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt

  let last_evaluated_key
  const scan: ScanPeopleRequest = {}
  const people: PersonRequest[] = []

  if (user_info.user_type === 'client') {
    scan.company_name = user_info.company_name
  }

  let operator_companies_access: OperatorCompaniesAccess | undefined

  if (user_info.user_type === UserGroupEnum.OPERATOR) {
    const operator_companies_access_key: OperatorCompaniesAccessKey = {
      user_id: user_info.user_id,
    }

    operator_companies_access = await getOperatorCompaniesAccess(operator_companies_access_key, dynamodbClient)
  }

  do {
    const query_result: ScanPeopleResponse | undefined = await scanPeople(
      scan,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!query_result) {
      logger.info({
        message: 'Finish on get people request info',
      })

      return {
        body: {
          message: 'Finish on query analysis people',
          people,
        },
      }
    }

    if (query_result?.result) {
      const people_memory_size = memorySizeOf(people)
      const people_memory_size_number = Number(people_memory_size)
      const people_memory_size_unit = people_memory_size.split(' ')[1]

      const result_memory_size = memorySizeOf(query_result.result)
      const result_memory_size_number = Number(result_memory_size.split(' ')[0])
      const result_memory_size_unit = result_memory_size.split(' ')[1]

      const is_gigabytes = people_memory_size_unit === 'GiB' || result_memory_size_unit === 'GiB'
      const is_megabytes = people_memory_size_unit === 'MiB' || result_memory_size_unit === 'MiB'

      const is_greater_than_6mb = people_memory_size_number + result_memory_size_number > 6

      const is_greater_than_lambda_limit = is_gigabytes
        ? true
        : !!(is_megabytes && is_greater_than_6mb)

      if (is_greater_than_lambda_limit) {
        last_evaluated_key = undefined
      } else {
        for (const item of query_result.result) {
          if (user_info.user_type !== UserGroupEnum.ADMIN) {
            if (user_info.user_type === UserGroupEnum.OPERATOR) {
              const to_be_shown_operator = !operator_companies_access || (operator_companies_access && operator_companies_access.companies.includes(item.company_name))

              if (!to_be_shown_operator) {
                continue
              }
            }
            const { third_party, ...person_item } = item

            people.push(person_item)
          } else {
            people.push(item)
          }
        }
      }
    }

    last_evaluated_key = query_result.last_evaluated_key
  } while (last_evaluated_key)

  people.sort(
    (r1, r2) => r1.created_at > r2.created_at
      ? 1
      : r1.created_at < r2.created_at
        ? -1
        : 0,
  )

  logger.info({
    message: 'Finish on get people request info',
  })

  return {
    body: {
      message: 'Finish on query analysis people',
      people,
    },
  }
}

export default listPeopleController
