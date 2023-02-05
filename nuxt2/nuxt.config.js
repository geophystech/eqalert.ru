export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '%s | EQA!ert',
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
    '@nuxtjs/dayjs'
  ],

  axios: {
    //
  },

  dayjs: {
    locales: ['ru'],
    defaultLocale: 'ru',
    plugins: ['utc', 'timezone']
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
