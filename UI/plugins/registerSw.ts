import { useAuthStore } from '~/stores'

async function requestPermissionForNotification() {
  // request permission for notifications
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      await registerServiceWorker()
    }
  } catch (err) {
    console.log(err)
  }
}

async function registerServiceWorker() {
  const { PUBLIC_VAPID_KEY } = useRuntimeConfig().public
  const http = useFetchAuth()
  if ('serviceWorker' in navigator) {
    // register the service worker
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })

    // register push service
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: PUBLIC_VAPID_KEY
    })

    // send the subscription object to the api
    await http('/notifications', { method: 'POST', body: JSON.stringify(subscription) })
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', async () => {
    const authStore = useAuthStore()
    if (authStore.isLoggedIn) {
      await requestPermissionForNotification()
    }
  })
})
