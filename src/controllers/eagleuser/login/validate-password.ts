import { compareSync } from 'bcryptjs'
import { User } from 'src/models/dynamo/user'
import ErrorHandler from 'src/utils/error-handler'
import logger from 'src/utils/logger'

const validatePassword = (
  user: User,
  password: string,
): void => {
  logger.debug({
    message: 'Validating password',
  })
  const isValidPassword = compareSync(password, user.password)

  if (!isValidPassword) {
    logger.warn({
      message: 'Invalid password',
    })

    throw new ErrorHandler('Senha inválida', 401)
  }
}

export default validatePassword
