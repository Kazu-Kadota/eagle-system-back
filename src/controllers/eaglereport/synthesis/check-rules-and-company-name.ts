import ErrorHandler from 'src/utils/error-handler'
import { UserInfoFromJwt } from 'src/utils/extract-jwt-lambda'
import logger from 'src/utils/logger'

export type CheckRulesAndCompanyNameParams = {
  company_name?: string
  start_date: string
  user_info: UserInfoFromJwt
}

const checkRulesAndCompanyName = ({
  company_name,
  start_date,
  user_info,
}: CheckRulesAndCompanyNameParams) => {
  const is_client_and_earlier_than_60_days = user_info.user_type === 'client'
    && new Date(start_date).valueOf() < new Date().valueOf() - 60 * 24 * 60 * 60 * 1000

  if (is_client_and_earlier_than_60_days) {
    logger.warn({
      message: 'Requested report earlier than 60 days',
      start_date,
    })

    throw new ErrorHandler('Não é possível gerar relatório com mais de 60 dias de diferença', 400)
  }

  let company: string

  if (user_info.user_type === 'admin') {
    if (!company_name) {
      logger.warn({
        message: 'Is necessary inform company to generate report',
      })

      throw new ErrorHandler('É necessário informar a empresa para gerar relatório', 400)
    }
    company = company_name
  } else {
    company = user_info.company_name
  }

  return company
}

export default checkRulesAndCompanyName
