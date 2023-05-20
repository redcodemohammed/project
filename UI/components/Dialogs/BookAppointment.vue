<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import { ar } from 'date-fns/locale'
import { Doctor } from '~/types'
const $http = useFetchAuth()
export interface DoctorCardProps {
  doctor: Doctor
}

const { doctor } = defineProps<DoctorCardProps>()

const dialog = ref(false)
const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

const message = ref('')
const date = ref(new Date())
const loading = ref(false)
async function send() {
  loading.value = true
  try {
    await $http('/appointments', {
      body: JSON.stringify({
        message: message.value,
        doctorId: doctor.id,
        startTime: date.value
      }),
      method: 'POST'
    })
  } catch {
  } finally {
    loading.value = dialog.value = false
  }
}
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="auto" fullscreen>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props" variant="text"> حجز موعد </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">حجز موعد لدى الطبيب</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <vue-date-picker
                  :day-names="daysOfWeek.map((day) => day.substring(0, 3))"
                  :formatLocale="ar"
                  locale="ar"
                  dark
                  :is24="false"
                  v-model="date" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="message" label="رسالة"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> اغلاق </v-btn>
          <v-btn :loading="loading" color="blue-darken-1" variant="text" @click="send"> ارسال </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
