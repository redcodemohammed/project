<script lang="ts" setup>
import { Doctor } from '~~/types'

export interface DoctorCardProps {
  doctor: Doctor
}

defineProps<DoctorCardProps>()
</script>

<template>
  <v-card class="mx-auto">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate></v-progress-linear>
    </template>

    <!-- <v-img cover height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img> -->

    <v-card-item>
      <v-card-title>{{ doctor.user?.name }}</v-card-title>

      <v-card-subtitle>
        <span class="me-1">{{ doctor.specialty }}</span>

        <v-icon color="green-darken-1" icon="mdi-circle" size="small"></v-icon>
      </v-card-subtitle>
      <v-card-subtitle>
        <a :href="`mailto://${doctor.user?.email}`" class="text-grey">{{ doctor.user?.email }}</a>
      </v-card-subtitle>
    </v-card-item>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-actions>
      <v-btn
        color="green"
        variant="elevated"
        elevation="2"
        :to="{ path: '/chat', query: { doctorID: doctor.user?.id } }">
        التواصل
      </v-btn>
      <dialogs-book-appointment :doctor="doctor"></dialogs-book-appointment>
    </v-card-actions>
  </v-card>
</template>
