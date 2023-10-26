const getStringEnv = (key: string): string => {
  const value = process.env[key]

  if (value === undefined) {
    throw new Error(`${key} is not set`)
  }

  return value
}

export default getStringEnv
