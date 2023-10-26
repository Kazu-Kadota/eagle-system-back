import { genSaltSync, hashSync } from 'bcryptjs'

const hashPassword = (password: string): string => {
  const salt = genSaltSync()
  const hash = hashSync(password, salt)

  return hash
}

export default hashPassword
