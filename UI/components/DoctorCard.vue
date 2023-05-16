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

    <v-card-text>
      <!-- <div class="my-4 text-subtitle-1">$ • Italian, Cafe</div> -->
      <!--  -->
      <!-- <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div> -->
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <!-- <v-card-title>اوقات التوفر</v-card-title>

    <div class="px-4">
      <v-chip-group>
        <v-chip>5:30PM</v-chip>

        <v-chip>7:30PM</v-chip>

        <v-chip>8:00PM</v-chip>

        <v-chip>9:00PM</v-chip>
      </v-chip-group>
    </div> -->

    <v-card-actions>
      <v-btn
        color="green"
        variant="elevated"
        elevation="2"
        :to="{ path: '/chat', query: { doctorID: doctor.user?.id } }">
        التواصل
      </v-btn>
      <v-btn variant="text"> حجز موعد </v-btn>
    </v-card-actions>
  </v-card>
</template>
