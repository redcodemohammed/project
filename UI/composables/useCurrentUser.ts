import { useAuthStore } from '~/stores'
import { User } from '~/types'
export function useCurrentUser() {
  const $authStore = useAuthStore()
  return $authStore.user as User
}
