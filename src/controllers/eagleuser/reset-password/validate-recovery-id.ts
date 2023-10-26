import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { User } from 'src/models/dynamo/user'
import deleteRecoveryPassword from 'src/services/aws/dynamo/user/recovery-password/delete'
import getRecoveryPassword from 'src/services/aws/dynamo/user/recovery-password/get'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const validateRecoveryId = async (
  recovery_id: string,
  user: User,
  dynamodbClient: DynamoDBClient,
): Promise<void> => {
  const recovery_password = await getRecoveryPassword({ recovery_id }, dynamodbClient)

  if (!recovery_password) {
    logger.warn({
      message: 'Recovery password not found',
      recovery_id,
    })

    throw new ErrorHandler('Restauração de senha não encontrada', 404)
  }

  const now = new Date().toISOString()

  if (now > recovery_password.expires_at) {
    await deleteRecoveryPassword({ recovery_id }, dynamodbClient)

    logger.warn({
      message: 'Expired recovery password',
      recovery_id,
      expires_at: recovery_password.expires_at,
    })

    throw new ErrorHandler('Solicitação de troca de senha expirada', 403)
  }

  if (recovery_password.user_id !== user.user_id) {
    await deleteRecoveryPassword({ recovery_id }, dynamodbClient)

    logger.warn({
      message: 'User is not the same requested to recovery password',
      recovery_id,
      requested_user_id: recovery_password.user_id,
      email_user_id: user.user_id,
    })

    throw new ErrorHandler('Usuário do email não é o mesmo solicitado para recuperar a senha', 400)
  }
}

export default validateRecoveryId
