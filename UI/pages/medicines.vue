<script setup lang="ts">
import { User, Medicine } from '@/types'
import { useAuthStore } from '~~/stores'

const $route = useRoute()
const $authFetch = useFetchAuth()
const $snackbar = useSnackbar()
const $authStore = useAuthStore()
const $formatters = useFormatters()

const loading = ref(true)

const id = $authStore.user?.id
const patientUser = ref<User>(await $authFetch<User>(`/auth/patient/${id}`, { method: 'GET' }))
loading.value = false
async function reloadUser() {
  loading.value = true
  try {
    patientUser.value = await $authFetch<User>(`/auth/patient/${id}`, { method: 'GET' })
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// medicines tab
const medicines = computed(() => patientUser.value.patient?.medicines as Medicine[]) // TODO: fill with user data from API

function copy(text: string) {
  const clipboard = useClipboard()
  $snackbar.show({ message: 'تم النسخ للحافظة' })

  return clipboard.copy(text)
}

function chipColor(state: string) {
  // Active = 'active',
  // Completed = 'completed',
  // Expired = 'expired',
  // Suspended = 'suspended',
  // Deleted = 'deleted',
  return state === 'active' ? 'green' : state === 'completed' ? 'green' : state === 'suspended' ? 'blue' : 'red'
}

function chipState(state: string) {
  return state === 'active'
    ? 'فعال'
    : state === 'completed'
    ? 'مكتمل'
    : state === 'expired'
    ? 'منتهي الصلاحية'
    : state === 'suspended'
    ? 'متوقف'
    : state === 'deleted'
    ? 'محذوف'
    : ''
}
</script>

<template>
  <v-container>
    <!-- data table -->
    <v-row>
      <!-- user actions -->
      <v-col cols="12">
        <v-card :loading="loading">
          <v-card-text>
            <v-card-title v-if="medicines.length > 0">الادوية</v-card-title>
            <v-table v-if="medicines.length > 0">
              <thead>
                <tr>
                  <th>اسم الدواء</th>
                  <th>تاريخ الاضافة</th>
                  <th>تاريخ تاريخ انتهاء الصلاحية</th>
                  <th>سبب الاضافة</th>
                  <th>الحالة</th>
                  <th>بواسطة</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="medicine in medicines">
                  <td>{{ medicine.name }}</td>
                  <td>{{ $formatters.formatDate(medicine.created_at).value }}</td>
                  <td>{{ $formatters.formatDate(medicine.expiry_date).value }}</td>

                  <td>{{ medicine.reason }}</td>
                  <td>
                    <v-chip :color="chipColor(medicine.state)">{{ chipState(medicine.state) }}</v-chip>
                  </td>
                  <td>
                    <v-btn variant="text" :to="`/user/${medicine.doctor_id}`">عرض الطبيب</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-alert
              v-else
              type="info"
              title="لا توجد ادوية"
              text="المريض ليس لديه ادوية حاليا, يمكنك اضافة دواء جديد من قائمة الاجراءات"
              variant="tonal"></v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
