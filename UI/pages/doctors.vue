<script setup lang="ts">
import { Doctor } from '@/types'
import { useAuthStore } from '~~/stores'

const $route = useRoute()
const $authFetch = useFetchAuth()
const $snackbar = useSnackbar()
const $authStore = useAuthStore()
const $formatters = useFormatters()
const { copy } = useHelpers()
const showQR = false
const loading = ref(true)

const doctors = ref(await $authFetch<Doctor[]>(`/auth/doctors`, { method: 'GET' }))
loading.value = false
</script>

<template>
  <v-container>
    <!-- data table -->
    <v-col v-if="doctors.length <= 0">
      <v-card :loading="loading">
        <v-card-text>
          <v-alert
            type="info"
            title="لا يوجد اطباء في هذه القائمة"
            text="يبدو ان حساب المريض هذا غير مرتبط باي طبيب, يجب ان يقوم الطبيب باضافتك لقائمة مرضاه لكي يظهر هنا"
            variant="tonal"></v-alert>
        </v-card-text>
      </v-card>
    </v-col>
    <v-row>
      <!-- user info card -->
      <v-col cols="12" lg="3" sm="4">
        <v-card>
          <v-card-title>اضافة لحساب الطبيب</v-card-title>
          <v-card-text>
            <div>
              <div align="center">
                <div v-if="showQR">
                  <div>
                    <v-img
                      width="150"
                      :lazy-src="`https://api.qrserver.com/v1/create-qr-code/?size=10x10&data=${$authStore.user?.id}`"
                      :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${$authStore.user?.id}`"></v-img>
                  </div>
                  <div class="mt-2">يمكن للطبيب اضافتك عن طريق مسح الكود</div>
                </div>
                <v-divider class="my-5"></v-divider>
                <div>
                  <span v-if="showQR">او</span>
                  عن طريق الرقم التسلسلي الخاص بك {{ $authStore.user?.patient?.id }}
                  <v-icon @click="copy($authStore.user?.patient?.id)">mdi-content-copy</v-icon>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="3" sm="4" v-for="doctor in doctors">
        <DoctorCard :doctor="doctor"></DoctorCard>
      </v-col>
    </v-row>
  </v-container>
</template>
