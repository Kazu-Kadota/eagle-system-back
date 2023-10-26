const stringToBase64 = (str: string): string => {
  return Buffer.from(str).toString('base64')
}

export default stringToBase64
