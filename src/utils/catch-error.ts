import { defaultHeaders } from 'src/constants/headers'

const catchError = (err: any) => {
  if (err.isTreated) {
    return {
      headers: defaultHeaders,
      statusCode: err.code,
      body: JSON.stringify(err.toObject()),
    }
  }

  console.log(err)

  if (err.$metadata) {
    return {
      headers: defaultHeaders,
      statusCode: err.$metadata.httpStatusCode,
      body: JSON.stringify({
        message: 'AWS error: ' + err.name,
      }),
    }
  }

  return {
    headers: defaultHeaders,
    statusCode: 500,
    body: JSON.stringify({
      message: 'Internal Server Error',
    }),
  }
}

export default catchError
