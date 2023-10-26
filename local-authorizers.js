const AWS = require('aws-sdk')
const mylocalAuthProxyFn = async (event, context) => {
  const lambda = new AWS.Lambda()
  const result = await lambda.invoke({
    FunctionName: 'eagleauth-auth-prd',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({
      authorizationToken: event.headers.Authorization,
    }),
  }).promise()

  if (result.StatusCode === 200) {
    return JSON.parse(result.Payload)
  }

  throw Error('Authorizer error')
}

module.exports = { mylocalAuthProxyFn }
