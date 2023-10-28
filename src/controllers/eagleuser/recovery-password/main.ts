import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SESClient } from '@aws-sdk/client-ses'
import { APIGatewayProxyEvent } from 'aws-lambda'
import fsPromises from 'fs/promises'
import mustache from 'mustache'
import path from 'path'
import { ReturnResponse } from 'src/models/lambda'
import { SESSendEmailOptions } from 'src/models/ses'
import putRecoveryPassword from 'src/services/aws/dynamo/user/recovery-password/put'
import sendEmail from 'src/services/aws/ses/text-send'
import getStringEnv from 'src/utils/get-string-env'
import logger from 'src/utils/logger'

import createResetToken from './create-token'
import queryUserByEmailAdapter from './get-user-by-email-adapter'
import validateBody from './validate'

const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' })
const sesClient = new SESClient({ region: 'us-east-1' })

const recoveryPasswordController = async (event: APIGatewayProxyEvent): Promise<ReturnResponse<any>> => {
  logger.debug({
    message: 'Start recovery password path',
  })

  const { email } = validateBody(JSON.parse(event.body ?? ''))

  const user = await queryUserByEmailAdapter(email, dynamodbClient)

  if (!user) {
    return {
      body: {
        message: 'Recovery password email send',
        email,
      },
    }
  }

  const date = new Date()
  date.setMinutes(date.getMinutes() + 30)
  const expires_date = date.toISOString()

  const recovery_token = createResetToken()

  await putRecoveryPassword(
    { recovery_id: recovery_token },
    { expires_at: expires_date, user_id: user.user_id },
    dynamodbClient,
  )

  const url = `${getStringEnv('USER_RECOVERY_KEY_URL')}?recovery_id=${recovery_token}&email=${email}`

  const email_data = {
    url,
    expires_date: date.toLocaleString(),
    destination: email,
  }

  const file_path = path.join(__dirname, '..', '..', '..', 'templates', 'recovery-password.mustache')

  const template = await fsPromises.readFile(file_path, 'utf-8')

  const body_html = mustache.render(template.toString(), email_data)

  const send_email: SESSendEmailOptions = {
    destination: email,
    from: getStringEnv('SYSTEMEAGLE_EMAIL'),
    subject: 'Recuperação de Senha - EagleSystem',
    html: body_html,
  }

  await sendEmail(send_email, sesClient)

  logger.info({
    message: 'Recovery password email send',
    email,
  })

  return {
    body: {
      message: 'Recovery password email send',
      email,
    },
  }
}

export default recoveryPasswordController
