class Config {
  constructor() {
    this.authorizationType = 'Bearer'
    this.baseURL = 'https://api-test.geophystech.ru/api'
    this.version = 'v1'
    this.endpointAnalyticsCumulativeCounts = `${this.baseURL}/${this.version}/analytics/cumulativeCounts`
    this.endpointAnalyticsDensityCounts = `${this.baseURL}/${this.version}/analytics/densityCounts`
    this.endpointAnalyticsEarthquakeCounts = `${this.baseURL}/${this.version}/analytics/earthquakeCounts`
    this.endpointAnalyticsRMSAllocation = `${this.baseURL}/${this.version}/analytics/RMSAllocation`
    this.endpointAnalyticsStationCounts = `${this.baseURL}/${this.version}/analytics/stationCounts`
    this.endpointEvents = `${this.baseURL}/${this.version}/reports`
    this.endpointStations = `${this.baseURL}/${this.version}/stations`
    this.endpointSystemInfo = `${this.baseURL}/${this.version}/systemInfo`
  }

  endpointEventPga(hashid) {
    return `${this.baseURL}/${this.version}/pga/${hashid}/concaveHulls`
  }
}

export default Config
