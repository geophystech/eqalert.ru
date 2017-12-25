const baseURL = 'https://api-test.geophystech.ru/api'
const version = 'v1'

let config = {}

config.authorizationType = 'Bearer'

// Endpoints after `api/v1/`.
config.endpoints = {
  analyticsEarthquakeCounts: 'analytics/earthquakeCounts',
  analyticsCumulativeCounts: 'analytics/cumulativeCounts',
  analyticsDensityCounts: 'analytics/densityCounts',
  analyticsStationCounts: 'analytics/stationCounts',
  analyticsRMSAllocation: 'analytics/RMSAllocation',
  events: 'reports',
  stations: 'stations',
  systemInfo: 'systemInfo'
}

// Add `baseURL` and `version` to each endpoint.
Object.keys(config.endpoints).map((key, index) => {
  config.endpoints[key] = `${baseURL}/${version}/${config.endpoints[key]}`
})

export default config
