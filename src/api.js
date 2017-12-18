let config = {}

config.authorizationType = 'Bearer'
config.baseURL = 'https://api-test.geophystech.ru/api'
config.version = 'v1'

// Endpoints after `api/v1/`.
config.endpoints = {
  reports: 'reports',
  stations: 'stations',
  systemInfo: 'systemInfo'
}

// Add `baseURL` and `version` to each endpoint.
Object.keys(config.endpoints).map((key, index) => {
  config.endpoints[key] = `${config.baseURL}/${config.version}/${config.endpoints[key]}`
})

export default config
