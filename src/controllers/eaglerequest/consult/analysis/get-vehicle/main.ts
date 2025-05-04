import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { UserGroupEnum } from 'src/models/dynamo/user'
import { OperatorCompaniesAccessKey } from 'src/models/dynamo/users/operator-companies-access'
import { Controller } from 'src/models/lambda'
import getOperatorCompaniesAccess from 'src/services/aws/dynamo/user/operator-companies-access/get'
import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'

import logger from 'src/utils/logger'

import getS3AnalysisInfoAdapter, { GetS3AnalysisInfoAdapterParams } from './get-s3-analysis-info-adapter'
import getVehicleAdapter from './get-vehicle-adapter'
import validateVehicleParam from './validate-param'
import validateVehicleQuery from './validate-query'

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
})

const s3Client = new S3Client({
  region: 'us-east-1',
})

const getVehicleByRequestIdController: Controller = async (req) => {
  const user_info = req.user_info as UserInfoFromJwt

  const { vehicle_id } = validateVehicleParam({ ...req.pathParameters })
  const { request_id } = validateVehicleQuery({ ...req.queryStringParameters })

  const request_vehicle_key: VehicleRequestKey = {
    vehicle_id,
    request_id,
  }

  const request_vehicle = await getVehicleAdapter(request_vehicle_key, user_info, dynamodbClient)

  if (user_info.user_type === UserGroupEnum.OPERATOR) {
    const operator_companies_access_key: OperatorCompaniesAccessKey = {
      user_id: user_info.user_id,
    }

    const operator_companies_access = await getOperatorCompaniesAccess(operator_companies_access_key, dynamodbClient)

    const to_be_shown_operator = !operator_companies_access || (operator_companies_access && operator_companies_access.companies.includes(request_vehicle.company_name))

    if (!to_be_shown_operator) {
      logger.info({
        message: 'User not allowed to receive response',
        request_id,
        vehicle_id,
      })

      throw new ErrorHandler('Análise de veículo não encontrado.', 404)
    }
  }

  if (request_vehicle.finished_at) {
    // Is temporary
    const is_s3_path = request_vehicle.analysis_info?.split('.')[1] === 'json'

    if (is_s3_path) {
      const get_s3_analysis_info_params: GetS3AnalysisInfoAdapterParams = {
        analysis_info: request_vehicle.analysis_info as string,
        s3_client: s3Client,
        third_party: !!request_vehicle.third_party,
      }

      const analysis_info = await getS3AnalysisInfoAdapter(get_s3_analysis_info_params)

      request_vehicle.analysis_info = analysis_info
    }
  }

  if (user_info.user_type === UserGroupEnum.CLIENT) {
    delete request_vehicle.third_party
  }

  return {
    body: {
      message: 'Finish on get request vehicle',
      vehicle: request_vehicle,
    },
  }
}

export default getVehicleByRequestIdController
