import { LRUCache } from 'lru-cache'
import getStringEnv from 'src/utils/get-string-env'

const cache_options = {
  ttl: 3 * 60 * 60, // 3 hours: 60 seconds * 60 minutes * 3 hours
  ttlAutopurge: true,
}

const token_cache = new LRUCache(cache_options)

const TECHMIZE_API_V2_TOKEN = getStringEnv('TECHMIZE_API_V2_TOKEN')

const techmizeV2Token = () => {
  if (!token_cache.has('token')) {
    token_cache.set('token', TECHMIZE_API_V2_TOKEN)
  }

  return token_cache.get('token') as string
}

export default techmizeV2Token
