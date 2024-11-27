import zlib from 'zlib'

const compressValue = (value: zlib.InputType) => {
  return zlib.gzipSync(value).toString('base64')
}

export default compressValue
