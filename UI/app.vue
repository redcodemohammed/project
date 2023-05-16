<script setup lang="ts">
import { useTheme } from 'vuetify'
const $snackbar = useSnackbar()
const $theme = useTheme()

$theme.global.name.value = 'dark'
</script>

<template>
  <v-layout>
    <nuxt-layout>
      <v-app>
        <v-snackbar location="left top" v-model="$snackbar.state.value.show" :timeout="$snackbar.state.value.timeout"
          >{{ $snackbar.state.value.message }}
          <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="$snackbar.state.value.show = false"> اغلاق </v-btn>
          </template></v-snackbar
        >
        <nuxt-page />
      </v-app>
    </nuxt-layout>
  </v-layout>
</template>
