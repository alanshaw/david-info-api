import express from 'express'
import compress from 'compression'
import { RedisCache, MemoryCache } from './cache.js'
import Infobase from './infobase.js'
import NpmWatcher from './npmwatch.js'
import { cors } from './middleware.js'

export function start (config) {
  if (!config) throw new Error('missing config')
  const cache = config.cache?.type === 'redis' ? new RedisCache(config.cache) : new MemoryCache(config.cache)
  if (cache instanceof MemoryCache) console.warn('🚨 Using in memory cache')
  const npmWatcher = new NpmWatcher(config.npmFeedUrl)
  const infobase = new Infobase(cache)

  // When a user publishes a package, delete cached david info
  npmWatcher.on('change', async change => {
    if (change.doc && change.doc.name) {
      try {
        await cache.del(change.doc.name)
      } catch (err) {
        console.error('failed to delete cached dependency info', err)
      }
    }
  })

  const app = express()

  app.use(compress())
  app.use(express.json())
  app.use(cors)

  app.post('/', async (req, res) => res.json(await infobase.get(req.body)))

  return new Promise(resolve => {
    const server = app.listen(config.port, () => {
      console.log(`Info API listening at http://localhost:${server.address().port}`)
      resolve(server)
    })
  })
}
