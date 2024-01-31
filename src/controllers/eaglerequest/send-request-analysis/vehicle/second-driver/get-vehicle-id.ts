import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PlateStateEnum } from 'src/models/dynamo/request-enum'
import queryVehicleByPlate from 'src/services/aws/dynamo/analysis/vehicle/query-by-plate'
import queryRequestVehicleByPlate, { QueryRequestVehicleByPlateQuery } from 'src/services/aws/dynamo/request/analysis/vehicle/query-by-plate'
import { v4 as uuid } from 'uuid'

const getVehicleId = async (
  plate: string,
  plate_state: PlateStateEnum,
  dynamodbClient: DynamoDBClient,
) => {
  const vehicle = await queryVehicleByPlate(plate, plate_state, dynamodbClient)

  const query_requested_vehicle: QueryRequestVehicleByPlateQuery = {
    plate,
    plate_state,
  }

  const requested_vehicle = await queryRequestVehicleByPlate(
    query_requested_vehicle,
    dynamodbClient,
  )

  let vehicle_id: string

  if (vehicle && vehicle[0]) {
    vehicle_id = vehicle[0].vehicle_id
  } else if (requested_vehicle && requested_vehicle[0]) {
    vehicle_id = requested_vehicle[0].vehicle_id
  } else {
    vehicle_id = uuid()
  }

  return vehicle_id
}

export default getVehicleId
