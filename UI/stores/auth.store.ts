import { defineStore } from 'pinia'
import { AuthResponse, ProfileResponse, RegisterResponse, User } from '@/types'
import { UserType, UserEndpoints } from '~~/enums'

export const useAuthStore = defineStore('auth-store', () => {
  const API_URL = useRuntimeConfig().public.API_URL
  const $router = useRouter()

  const accessTokenRef = useCookie('accessToken')
  const wsTokenRef = useCookie('wsToken')
  const userRef = ref<User | null>(null)
  const isLoggedInRef = computed(() => !!accessTokenRef.value)

  async function login(email: string, password: string) {
    const url = `${API_URL}${UserEndpoints.Login}`
    const body = { email, password }
    const { token, wsToken } = await $fetch<AuthResponse>(url, { body, method: 'POST' })

    accessTokenRef.value = token
    wsTokenRef.value = wsToken

    await fetchUser()

    $router.push(userRef.value?.user_type === UserType.Doctor ? '/patients' : '/')
  }
  async function signUp(
    name: string,
    email: string,
    password: string,
    isDoctor: boolean,
    birthdate?: string,
    specialty?: string
  ) {
    const url = `${API_URL}${UserEndpoints.Register}`
    const body = { name, email, password, userType: isDoctor ? UserType.Doctor : UserType.Patient }

    if (isDoctor) {
      Object.assign(body, { ...body, specialty })
    } else {
      Object.assign(body, { ...body, birthdate })
    }

    const { token, user } = await $fetch<RegisterResponse>(url, { body, method: 'POST' })

    accessTokenRef.value = token.token

    setUser(user)

    $router.push('/')
  }

  async function fetchUser() {
    const url = `${API_URL}${UserEndpoints.Profile}`
    const { user } = await $fetch<ProfileResponse>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessTokenRef.value}`
      }
    })
    setUser(user)
  }
  function setUser(user: User | null) {
    userRef.value = user
  }
  async function logout() {
    const url = `${API_URL}${UserEndpoints.Logout}`
    await $fetch<ProfileResponse>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessTokenRef.value}`
      }
    })
    setUser(null)
    accessTokenRef.value = null

    $router.push('/login')
  }

  return {
    API_URL,
    accessToken: accessTokenRef,
    wsToken: wsTokenRef,
    user: userRef,
    isLoggedIn: isLoggedInRef,
    login,
    signUp,
    fetchUser,
    setUser,
    logout
  }
})
