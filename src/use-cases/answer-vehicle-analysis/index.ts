import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { AnalysisResultEnum } from 'src/models/dynamo/answer'
import { RequestStatusEnum } from 'src/models/dynamo/request-enum'
import { FinishedVehicleRequestBody, VehicleRequestKey } from 'src/models/dynamo/request-vehicle'
import { Vehicle, VehicleCompaniesContent, VehicleKey } from 'src/models/dynamo/vehicle'
import getVehicle from 'src/services/aws/dynamo/analysis/vehicle/get'
import putVehicle from 'src/services/aws/dynamo/analysis/vehicle/put'
import updateVehicle from 'src/services/aws/dynamo/analysis/vehicle/update'
import deleteRequestVehicle from 'src/services/aws/dynamo/request/analysis/vehicle/delete'
import getRequestVehicle from 'src/services/aws/dynamo/request/analysis/vehicle/get'
import putFinishedRequestVehicle from 'src/services/aws/dynamo/request/finished/vehicle/put'
import s3VehicleAnalysisAnswerPut from 'src/services/aws/s3/vehicle-analysis/answer/put'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'
import removeEmpty from 'src/utils/remove-empty'

export type UseCaseAnswerVehicleAnalysisParams = {
  analysis_info?: string
  analysis_result: AnalysisResultEnum
  dynamodbClient: DynamoDBClient,
  from_db: boolean
  request_id: string
  vehicle_id: string
  s3Client: S3Client
}

const useCaseAnswerVehicleAnalysis = async ({
  analysis_info,
  analysis_result,
  dynamodbClient,
  from_db,
  request_id,
  s3Client,
  vehicle_id,
}: UseCaseAnswerVehicleAnalysisParams): Promise<void> => {
  const request_vehicle_key: VehicleRequestKey = {
    vehicle_id,
    request_id,
  }

  const request_vehicle = await getRequestVehicle(request_vehicle_key, dynamodbClient)

  if (!request_vehicle) {
    logger.warn({
      message: 'Vehicle no exist',
      vehicle_id,
    })

    throw new ErrorHandler('Veículo não existe', 404)
  }

  const {
    company_name,
    vehicle_analysis_type,
    analysis_type,
  } = request_vehicle

  let analysis_info_value = analysis_info

  if (!request_vehicle.third_party) {
    analysis_info_value = await s3VehicleAnalysisAnswerPut({
      analysis_type,
      body: JSON.stringify(analysis_info),
      vehicle_analysis_type,
      vehicle_id,
      request_id,
      s3_client: s3Client,
    })
  }

  const now = new Date().toISOString()

  const finished_request_body: FinishedVehicleRequestBody = removeEmpty({
    ...request_vehicle,
    finished_at: now,
    status: RequestStatusEnum.FINISHED,
    analysis_info: analysis_info_value,
    analysis_result,
    from_db,
  })

  const finished_request_key: VehicleRequestKey = {
    request_id: request_vehicle.request_id,
    vehicle_id,
  }

  const get_vehicle_key: VehicleKey = {
    vehicle_id: request_vehicle.vehicle_id,
    plate: request_vehicle.plate,
  }

  const vehicle = await getVehicle(get_vehicle_key, dynamodbClient)

  const isApproved = analysis_result === AnalysisResultEnum.APPROVED

  let driver_name

  if (vehicle) {
    const companies_array = vehicle.companies[vehicle_analysis_type]?.name.includes(company_name)
      ? vehicle.companies[vehicle_analysis_type]?.name
      : vehicle.companies[vehicle_analysis_type]
        ? [...(vehicle.companies[vehicle_analysis_type] as VehicleCompaniesContent).name, company_name]
        : [company_name]

    if (request_vehicle.driver_name) {
      if (vehicle.driver_name) {
        driver_name = vehicle.driver_name.includes(request_vehicle.driver_name)
          ? vehicle.driver_name
          : [...vehicle.driver_name, request_vehicle.driver_name]
      } else {
        driver_name = [request_vehicle.driver_name]
      }
    }

    const vehicle_constructor: Vehicle = {
      ...vehicle,
      companies: {
        [vehicle_analysis_type]: {
          name: companies_array,
          request_id: request_vehicle.request_id,
          updated_at: now,
        },
      },
      updated_at: now,
      validated: {
        [vehicle_analysis_type]: {
          answer_description: analysis_info || '',
          approved: isApproved,
          protocol_id: request_vehicle.request_id,
          updated_at: now,
        },
      },
      driver_name,
    }

    const vehicle_constructor_removed = removeEmpty(vehicle_constructor)

    const { vehicle_id, plate, ...vehicle_body } = vehicle_constructor_removed

    const vehicle_key: VehicleKey = {
      vehicle_id,
      plate,
    }

    await putFinishedRequestVehicle(
      finished_request_key,
      finished_request_body,
      dynamodbClient,
    )

    await updateVehicle(
      vehicle_key,
      vehicle_body,
      dynamodbClient,
    )

    const vehicle_request_key: VehicleRequestKey = {
      request_id: request_vehicle.request_id,
      vehicle_id: request_vehicle.vehicle_id,
    }

    await deleteRequestVehicle(
      vehicle_request_key,
      dynamodbClient,
    )

    return
  }

  if (request_vehicle.driver_name) {
    driver_name = [request_vehicle.driver_name]
  }

  const vehicle_constructor: Vehicle = {
    companies: {
      [vehicle_analysis_type]: {
        name: [company_name],
        request_id: request_vehicle.request_id,
        updated_at: now,
      },
    },
    created_at: now,
    owner_document: request_vehicle.owner_document,
    owner_name: request_vehicle.owner_name,
    plate: request_vehicle.plate,
    updated_at: now,
    validated: {
      [vehicle_analysis_type]: {
        answer_description: analysis_info || '',
        approved: isApproved,
        protocol_id: request_vehicle.request_id,
        updated_at: now,
      },
    },
    vehicle_id: request_vehicle.vehicle_id,
    vehicle_model: request_vehicle.vehicle_model,
    vehicle_type: request_vehicle.vehicle_type,
    chassis: request_vehicle.chassis,
    driver_name,
    plate_state: request_vehicle.plate_state,
    renavam: request_vehicle.renavam,
    // black_list
  }

  const vehicle_constructor_removed = removeEmpty(vehicle_constructor)

  const {
    vehicle_id: vehicle_id_constructor,
    plate,
    ...vehicle_body
  } = vehicle_constructor_removed

  const vehicle_key: VehicleKey = {
    vehicle_id: vehicle_id_constructor,
    plate,
  }

  await putFinishedRequestVehicle(
    finished_request_key,
    finished_request_body,
    dynamodbClient,
  )

  await putVehicle(
    vehicle_key,
    vehicle_body,
    dynamodbClient,
  )

  const vehicle_request_key: VehicleRequestKey = {
    request_id: request_vehicle.request_id,
    vehicle_id: request_vehicle.vehicle_id,
  }

  await deleteRequestVehicle(
    vehicle_request_key,
    dynamodbClient,
  )
}

export default useCaseAnswerVehicleAnalysis
