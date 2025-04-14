import { S3Client } from '@aws-sdk/client-s3'
import s3PersonAnalysisAnswerGet from 'src/services/aws/s3/person-analysis/answer/get'
import s3PersonAnalysisAnswerThirdPartyGet from 'src/services/aws/s3/person-analysis/answer/third-party/get'

export type GetS3PersonAnalysisInfoAdapterParams = {
  analysis_info: string
  s3_client: S3Client
  third_party?: boolean
}

const getS3PersonAnalysisInfoAdapter = async ({
  analysis_info,
  s3_client,
  third_party,
}: GetS3PersonAnalysisInfoAdapterParams): Promise<any> => {
  return third_party
    ? await s3PersonAnalysisAnswerThirdPartyGet({
      key: analysis_info,
      s3_client,
    })
    : await s3PersonAnalysisAnswerGet({
      key: analysis_info,
      s3_client,
    })
}

export default getS3PersonAnalysisInfoAdapter
