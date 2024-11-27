import { RawAxiosRequestHeaders } from 'axios'

import techmizeV2Token from './token'

const techmizeApiV2DataSourceCustomRequestHeaders = (): RawAxiosRequestHeaders => ({
  token: techmizeV2Token(),
  'Content-Type': 'application/json',
})

export default techmizeApiV2DataSourceCustomRequestHeaders
