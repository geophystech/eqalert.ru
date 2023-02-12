const axios = require('axios')

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | EQA!ert',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'description',
        name: 'description',
        content: 'Eqalert.ru – информационная служба реального времени о землетрясениях, сейсмических воздействиях и опасности'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'землетрясение, интенсивность, сейсмическая опасность, сейсмические воздействия, пиковые ускорения грунта, ' +
          'сейсмический мониторинг, pga, msk64, информирование о землетрясении, эпицентр, гипоцентр, ' +
          'магнитуда, механизм очага, тензор момента, архив'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300&amp;subset=cyrillic' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/persistedstate.js', mode: 'client' },
    { src: '~/plugins/leaflet.js', mode: 'client' },
    { src: '~/plugins/analytics.js', mode: 'client' },
    { src: '~/plugins/idle.js', mode: 'client' },
    { src: '~/plugins/toasted.js', mode: 'client' },
    { src: '~/plugins/yandex-metrika.js', mode: 'client' },
    { src: '~/plugins/beautify.js', mode: 'client' },
    { src: '~/plugins/datetime.js', mode: 'client' },
    { src: '~/plugins/mobile.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/moment',
  ],

  moment: {
    defaultLocale: 'ru',
    locales: ['ru']
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/dayjs',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  axios: {
    //
  },

  sitemap: {
    cacheTime: 43200, // 12 hrs
    hostname: 'https://eqalert.ru',
    gzip: true,
    exclude: [
      '/**',
    ],
    routes: async () => {
      const constantRoutes = [
        '/',
        '/analytics',
        '/about',
        {
          url: '/events',
          changefreq: 'daily',
          priority: 1,
          lastmod: '2023-02-07T13:30:00.000Z'
        },
      ]
      const template = {
        changefreq: 'daily',
        priority: 1,
        lastmod: '2023-02-07T13:30:00.000Z'
      }
      const prefix = `https://rest-api.eqalert.ru`
      const route = `/api/v1/reports?limit=100&mag_min=3.5`
      let eventRoutes = []
      let data = (await axios.get(`${prefix}${route}`)).data
      let next = data.meta.cursor.next
      eventRoutes = [...eventRoutes, ...data.data.map(item => ({ url: `/events/${item.id}`, ...template }))]
      while (next) {
        data = (await axios.get(`${prefix}${route}&cursor=${next}`)).data
        next = data.meta.cursor.next
        eventRoutes = [...eventRoutes, ...data.data.map(item => ({ url: `/events/${item.id}`, ...template }))]
      }
      return [...constantRoutes, ...eventRoutes]
    }
  },

  robots: {
    UserAgent: '*',
    Allow: '/',
    Sitemap: 'https://eqalert.ru/sitemap.xml'
  },

  dayjs: {
    locales: ['ru'],
    defaultLocale: 'ru',
    plugins: ['utc', 'timezone']
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      compact: true
    }
  }
}
