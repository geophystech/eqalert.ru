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

  endpointEventBuildings(hashid) {
    return `${this.baseURL}/${this.version}/msk64/damagedBuildings/${hashid}`
  }

  endpointEvent(hashid) {
    return `${this.baseURL}/${this.version}/reports/${hashid}`
  }

  endpointEventMsk64(hashid) {
    return `${this.baseURL}/${this.version}/msk64/data/${hashid}`
  }

  endpointEventPga(hashid) {
    return `${this.baseURL}/${this.version}/pga/${hashid}/concaveHulls`
  }

  endpointMomentTensor(hashid) {
    return `${this.baseURL}/${this.version}/momentTensor/${hashid}`
  }

  endpointSettlements(hashid) {
    return `${this.baseURL}/${this.version}/msk64/citiesAnalysis/${hashid}`
  }
}

export default Config
