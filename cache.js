import Redis from 'ioredis'
import LRUCache from 'lru-cache'

const HOUR = 1000 * 60 * 60

export class RedisCache {
  constructor (config) {
    if (!config) throw new Error('missing config')
    if (!config.redisConnectionString) throw new Error('missing redis connection string in config')
    this._redis = new Redis(config.redisConnectionString, config.ioredis)
    this._maxAge = config.maxAge ?? HOUR
  }

  get (k) {
    return this._redis.get(k)
  }

  set (k, v) {
    return this._redis.set(k, v, 'PX', this._maxAge)
  }

  del (k) {
    return this._redis.del(k)
  }
}

export class MemoryCache {
  constructor (config) {
    this._lru = new LRUCache({ maxAge: config?.maxAge ?? HOUR })
  }

  get (k) {
    return this._lru.get(k)
  }

  set (k, v) {
    return this._lru.set(k, v)
  }

  del (k) {
    return this._lru.del(k)
  }
}
