import { LRUCache } from 'lru-cache'
import getStringEnv from 'src/utils/get-string-env'

const cache_options = {
  ttl: 3 * 60 * 60, // 3 hours: 60 seconds * 60 minutes * 3 hours
  ttlAutopurge: true,
}

const token_cache = new LRUCache(cache_options)

const TECHMIZE_API_NEW_V1_TOKEN = getStringEnv('TECHMIZE_API_NEW_V1_TOKEN')

const techmizeNewV1Token = () => {
  if (!token_cache.has('token')) {
    token_cache.set('token', TECHMIZE_API_NEW_V1_TOKEN)
  }

  return token_cache.get('token') as string
}

export default techmizeNewV1Token
