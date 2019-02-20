var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  // API_BASE_URL: '"https://api-test.geophystech.ru/api"',
  // API_OAUTH_BASE_URL: '"https://oauth-client-test.geophystech.ru"',
  NODE_ENV: '"development"'
})
