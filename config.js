import rc from 'rc'

const MINUTE = 1000 * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export default rc('david', {
  port: 3000,
  cache: {
    type: 'memory', // also 'redis' + redis prop for config
    maxAge: DAY
  },
  npmFeedUrl: 'https://skimdb.npmjs.com/registry'
})
