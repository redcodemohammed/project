import { useAuthStore } from '@/stores'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: any
  headers?: any
}

export const useFetchAuth = () => {
  const authStore = useAuthStore()
  // const router = useRouter()

  async function authFetch<T>(url: string, opt: FetchOptions, retry?: boolean) {
    return await $fetch<T>(`${authStore.API_URL}${url}`, {
      ...opt,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })
  }

  return authFetch
}
