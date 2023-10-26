import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { SESSendEmailOptions } from 'src/models/ses'
import logger from 'src/utils/logger'

const sendEmail = async (
  options: SESSendEmailOptions,
  sesClient: SESClient,
): Promise<undefined> => {
  logger.debug({
    message: 'Sending email using SES',
    email: options.destination,
  })

  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [options.destination],
    },
    Message: {
      Body: {
        Text: {
          Data: options.text,
        },
        Html: {
          Data: options.html,
        },
      },
      Subject: {
        Data: options.subject,
      },
    },
    Source: options.from,
  })

  await sesClient.send(command)

  return undefined
}

export default sendEmail
