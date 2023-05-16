import { useAuthStore } from '@/stores/auth.store'

const GLOBAL_MIDDLEWARE = { global: true }

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const publicPages = ['login', 'register']
  // check if the user is logged in
  addRouteMiddleware(
    'isLoggedIn',
    (to) => {
      // if not logged in
      if (!authStore.isLoggedIn) {
        if (!publicPages.includes(to.name?.toString() || '')) {
          // navigate everything into the login page
          return navigateTo('/login')
        }
      }
      // if logged in don't allow navigation to login page
      else {
        if (publicPages.includes(to.name?.toString() || '')) {
          return navigateTo('/')
        }
      }
    },
    GLOBAL_MIDDLEWARE
  )
})
