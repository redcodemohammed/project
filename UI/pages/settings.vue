<script setup lang="ts">
import { useTheme } from 'vuetify'
const tab = ref('one')
const $theme = useTheme()

function toggleTheme() {
  $theme.global.name.value = $theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
  <v-container>
    <v-toolbar rounded>
      <v-tabs v-model="tab"> <v-tab value="one">اعدادت الواجهة</v-tab> </v-tabs>
    </v-toolbar>
    <v-window v-model="tab" class="my-5">
      <v-window-item value="one">
        <v-card>
          <v-card-text>
            <v-btn @click="toggleTheme">الوضع الداكن</v-btn>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>
