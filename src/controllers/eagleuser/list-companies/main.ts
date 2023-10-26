import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Company } from 'src/models/dynamo/company'
import { ReturnResponse } from 'src/models/lambda'
import scanCompany, { ScanCompanyResponse } from 'src/services/aws/dynamo/company/scan'
import logger from 'src/utils/logger'
import { v4 as uuid } from 'uuid'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })

const requestCompanies = async (): Promise<ReturnResponse<any>> => {
  const request_id = uuid()
  let last_evaluated_key
  const result: Company[] = []

  do {
    const scan: ScanCompanyResponse | undefined = await scanCompany(
      request_id,
      dynamodbClient,
      last_evaluated_key,
    )

    if (!scan) {
      logger.info({
        message: 'Finish on get companies',
        companies: result,
      })

      return {
        body: {
          message: 'Finish on get companies',
          companies: result,
        },
      }
    }

    if (scan.result) {
      for (const item of scan.result) {
        result.push(item)
      }
    }

    last_evaluated_key = scan.last_evaluated_key
  } while (last_evaluated_key)

  result.sort(
    (r1, r2) => r1.name > r2.name
      ? 1
      : r1.name < r2.name
        ? -1
        : 0,
  )

  logger.info({
    message: 'Finish on get companies',
    companies: result,
  })

  return {
    body: {
      message: 'Finish on get companies',
      companies: result,
    },
  }
}

export default requestCompanies
