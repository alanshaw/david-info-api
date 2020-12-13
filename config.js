import rc from 'rc'

const MINUTE = 1000 * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export default rc('info-api', {
  port: 3000,
  cache: {
    type: 'memory', // also 'redis' + add additional ioredis prop for config
    maxAge: DAY,
    ioredis: {
      keyPrefix: 'info',
      enableAutoPipelining: true
    }
  },
  npmFeedUrl: 'https://skimdb.npmjs.com/registry'
})
