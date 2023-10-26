const removeEmpty = <T extends Record<string, any>> (obj: T):T => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
    // eslint-disable-next-line no-param-reassign
    else if (obj[key] === undefined || obj[key] === null || obj[key] === '') delete obj[key]
  })
  return obj
}

export default removeEmpty
