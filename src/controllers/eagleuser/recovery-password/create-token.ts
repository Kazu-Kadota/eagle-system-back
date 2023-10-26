import * as crypto from 'crypto'

const createResetToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

export default createResetToken
