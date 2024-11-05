import { RawAxiosRequestHeaders } from 'axios'

import techmizeV1Token from './token'

const techmizeApiV1DataSourceCustomRequestHeaders = (): RawAxiosRequestHeaders => ({
  token: techmizeV1Token(),
  'Content-Type': 'application/json',
})

export default techmizeApiV1DataSourceCustomRequestHeaders
