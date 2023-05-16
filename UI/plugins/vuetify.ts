import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'
import { VDataTable } from 'vuetify/labs/VDataTable'

// Translations provided by Vuetify
import { en, ar } from 'vuetify/locale'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      ...components,
      VDataTable
    },
    directives,
    locale: {
      locale: 'ar',
      fallback: 'en',
      messages: { ar, en }
    },

    blueprint: md3
  })

  nuxtApp.vueApp.use(vuetify)
})
