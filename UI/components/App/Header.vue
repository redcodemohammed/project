<script setup lang="ts">
import { UserType } from '~~/enums'
import { useAuthStore } from '~~/stores'

const $authStore = useAuthStore()

const links = computed(() => {
  const links = [
    // { name: 'المحادثات', icon: 'mdi-chat-outline', to: '/chat' },
    { name: 'الاعدادات', icon: 'mdi-cog-outline', to: '/settings' }
  ]

  const doctorLinks = [
    { name: 'الصفحة الرئيسية', icon: 'mdi-account-outline', to: '/patients' },
    { name: 'الحجوزات', icon: 'mdi-timelapse', to: '/appointments' },
    ...links
  ]
  const patientLinks = [
    { name: 'الصفحة الرئيسية', icon: 'mdi-home-outline', to: '/' },
    { name: 'قائمة الادوية', icon: 'mdi-medication-outline', to: '/medicines' },
    { name: 'قائمة الاطباء', icon: 'mdi-doctor', to: '/doctors' },
    ...links
  ]

  return $authStore.user?.user_type === UserType.Doctor ? doctorLinks : patientLinks
})

const drawer = ref(false)
</script>

<template>
  <v-navigation-drawer location="start" border v-model="drawer">
    <v-list-item :title="$authStore.user?.name" :subtitle="$authStore.user?.user_type"></v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item v-for="link in links" :prepend-icon="link.icon" :title="link.name" :to="link.to"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar density="compact" border title="''">
    <v-btn v-if="$authStore.isLoggedIn" @click="$authStore.logout">{{ $t('actions.logout') }}</v-btn>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  </v-app-bar>
</template>
