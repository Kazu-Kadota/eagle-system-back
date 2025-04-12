import { S3Client } from '@aws-sdk/client-s3'
import s3VehicleAnalysisAnswerGet from 'src/services/aws/s3/vehicle-analysis/answer/get'
import s3VehicleAnalysisAnswerThirdPartyGet from 'src/services/aws/s3/vehicle-analysis/answer/third-party/get'

export type GetS3AnalysisInfoAdapterParams = {
  analysis_info: string
  s3_client: S3Client
  third_party?: boolean
}

const getS3AnalysisInfoAdapter = async ({
  analysis_info,
  s3_client,
  third_party,
}: GetS3AnalysisInfoAdapterParams): Promise<any> => {
  return third_party
    ? await s3VehicleAnalysisAnswerThirdPartyGet({
      key: analysis_info,
      s3_client,
    })
    : await s3VehicleAnalysisAnswerGet({
      key: analysis_info,
      s3_client,
    })
}

export default getS3AnalysisInfoAdapter
