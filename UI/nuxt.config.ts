import vuetify from 'vite-plugin-vuetify'

// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    'vuetify/lib/styles/main.sass',
    'assets/fonts.css',
    'assets/variables.scss',
    '@mdi/font/css/materialdesignicons.css',
    '@sweetalert2/theme-material-ui/material-ui.scss',
    '@vuepic/vue-datepicker/dist/main.css',
    'v-calendar/style.css'
  ],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false
    }
  },
  modules: [
    async (options, nuxt) => {
      // @ts-ignore
      nuxt.hooks.hook('vite:extendConfig', (config) => config.plugins.push(vuetify()))
    },
    // https://v8.i18n.nuxtjs.org/
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-typed-router',
    '@vueuse/nuxt'
  ],

  i18n: {
    lazy: false,
    langDir: 'locales',
    locales: [
      { code: 'ar', file: 'ar.json' }
      // { code: 'en', file: 'en.json' }
    ],
    defaultLocale: 'ar',
    strategy: 'no_prefix'
  },

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || 'http://localhost:3333/v1',
      SOCKET_URL: process.env.API_URL || 'http://localhost:5555',
      PUBLIC_VAPID_KEY:
        process.env.PUBLIC_VAPID_KEY ||
        'BG--p9X-r8r_g3gRLFnXaunMdAyg80xXsvFcqommb-yvwQJVjeFSprhN7zDHVkQ8oMi2518K1h5OcDbGCVzgdrM'
    }
  }
})
