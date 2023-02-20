const GlobalSettings = {
  development: {
    API_BASE_URL: 'https://api-test.geophystech.ru/api',
    API_OAUTH_BASE_URL: 'https://oauth-client-test.geophystech.ru',
    API_VERSION: 'v1',
    HOST: 'https://eqalert-frontend-test.geophystech.ru',
    NAME_SPACE: 'eqalert-frontend-test.geophystech.ru',
  },
  production: {
    API_BASE_URL: 'https://rest-api.eqalert.ru/api',
    API_OAUTH_BASE_URL: 'https://oauth-web.eqalert.ru',
    API_VERSION: 'v1',
    HOST: 'https://eqalert.ru',
    NAME_SPACE: 'eqalert.ru',
  }
}

export { GlobalSettings }
