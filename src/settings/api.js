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

  endpointEventBuildings(id) {
    return `${this.baseURL}/${this.version}/msk64/damagedBuildings/${id}`
  }

  endpointEvent(id) {
    return `${this.baseURL}/${this.version}/reports/${id}`
  }

  endpointEventMsk64(id) {
    return `${this.baseURL}/${this.version}/msk64/data/${id}`
  }

  endpointEventPga(id) {
    return `${this.baseURL}/${this.version}/pga/${id}/concaveHulls`
  }

  endpointMomentTensor(id) {
    return `${this.baseURL}/${this.version}/momentTensor/${id}`
  }

  endpointSettlements(id) {
    return `${this.baseURL}/${this.version}/msk64/citiesAnalysis/${id}`
  }
}

export default Config
