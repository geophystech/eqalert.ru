class Config
{
  constructor()
  {
    this.authorizationType = 'Bearer'

    this.baseURL = process.env.API_BASE_URL ?? 'https://rest-api.eqalert.ru/api'
    this.oauthBaseURL = process.env.API_OAUTH_BASE_URL ?? 'https://oauth-web.eqalert.ru'
    this.version = process.env.API_VERSION ?? 'v1'

    this.endpointAnalyticsCumulativeCounts = `${this.baseURL}/${this.version}/analytics/cumulativeCounts`
    this.endpointAnalyticsDensityCounts = `${this.baseURL}/${this.version}/analytics/densityCounts`
    this.endpointAnalyticsEarthquakeCounts = `${this.baseURL}/${this.version}/analytics/earthquakeCounts`
    this.endpointAnalyticsRMSAllocation = `${this.baseURL}/${this.version}/analytics/RMSAllocation`
    this.endpointAnalyticsStationCounts = `${this.baseURL}/${this.version}/analytics/stationCounts`
    this.endpointEvents = `${this.baseURL}/${this.version}/reports`
    this.endpointEventsLight = `${this.baseURL}/${this.version}/reports/lightweightList`
    this.endpointPurposesList = `${this.baseURL}/${this.version}/user/purposesList`
    this.endpointStations = `${this.baseURL}/${this.version}/stations`
    this.endpointBuildings = `${this.baseURL}/${this.version}/buildings`
    this.endpointLDOs = `${this.baseURL}/${this.version}/ldo`
    this.endpointSystemInfo = `${this.baseURL}/${this.version}/systemInfo`
    this.endpointUserAuthentication = `${this.oauthBaseURL}/token`
    this.endpointUserRefreshToken = `${this.oauthBaseURL}/refreshToken`
    this.endpointUserRefreshScopes = `${this.baseURL}/${this.version}/oauth/scopes`
    this.endpointUserRegistration = `${this.baseURL}/${this.version}/user/register`
    this.endpointUserResetPassword = `${this.baseURL}/${this.version}/user/resetPassword`
    this.endpointUserResetPasswordCheck = `${this.baseURL}/${this.version}/user/resetPasswordCheck`
    this.endpointUserResetPasswordComplete = `${this.baseURL}/${this.version}/user/resetPasswordComplete`
    this.endpointFeltReportPoll = `${this.baseURL}/${this.version}/feltReport/poll`
    this.endpointFeltReport = `${this.baseURL}/${this.version}/feltReport`
  }

  endpointEmailConfirmation(token) {
    return `${this.baseURL}/${this.version}/user/emailConfirm/${token}`
  }

  endpointEventBuildings(id) {
    return `${this.baseURL}/${this.version}/pga/damagedBuildings/${id}`
  }

  endpointEvent(id) {
    return `${this.baseURL}/${this.version}/reports/${id}`
  }

  endpointEventMeasuredIntensityAggregations(id) {
    return `${this.baseURL}/${this.version}/reports/${id}/measuredIntensityAggregations`
  }

  endpointEventLDOs(id) {
    return `${this.baseURL}/${this.version}/pga/damagedLongDistanceObjects/${id}`
  }

  endpointLdoParts(ldoId) {
    return `${this.baseURL}/${this.version}/ldo/${ldoId}`
  }

  endpointEventMsk64(id) {
    return `${this.baseURL}/${this.version}/msk64/data/${id}`
  }

  endpointEventPga(id) {
    return `${this.baseURL}/${this.version}/pga/${id}/concaveHulls`
  }

  endpointEventSettlements(id) {
    return `${this.baseURL}/${this.version}/msk64/citiesAnalysis/${id}`
  }

  endpointMomentTensor(id) {
    return `${this.baseURL}/${this.version}/momentTensor/${id}`
  }
}

export default new Config()
