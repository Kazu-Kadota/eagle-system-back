import { RawAxiosRequestHeaders } from 'axios'

import techmizeNewV1Token from './token'

const techmizeApiNewV1Headers = (): RawAxiosRequestHeaders => ({
  Authorization: 'Bearer ' + techmizeNewV1Token(),
  'Content-Type': 'application/json',
})

export default techmizeApiNewV1Headers
