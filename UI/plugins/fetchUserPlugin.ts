import { useAuthStore } from '@/stores/auth.store'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', async () => {
    const $authStore = useAuthStore()
    if ($authStore.isLoggedIn) {
      await $authStore.fetchUser()
    }
  })
})
