<script setup lang="ts">
import { User, Medicine } from '@/types'
import { useAuthStore } from '~~/stores'

const $route = useRoute()
const $authFetch = useFetchAuth()
const $authStore = useAuthStore()
const $formatters = useFormatters()
const { copy } = useHelpers()

const loading = ref(true)

let id = ''
if ($route.name === 'patient-id') {
  id = $route.params.id
}
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
// tabs
const tab = ref('medicines')

// medicines tab
const medicines = computed(() => patientUser.value.patient?.medicines as Medicine[]) // TODO: fill with user data from API

// remove a medicine
async function removeMedicine(id: number) {
  try {
    const { value: removeReason } = await useSweetAlert.fire<string>({
      title: 'اكتب سبب الحذف',
      input: 'textarea',
      showCancelButton: true,
      cancelButtonText: 'الغاء',
      confirmButtonText: 'حذف'
    })
    if (removeReason) {
      loading.value = true
      await $authFetch<Medicine>(`/medicines/${id}`, {
        method: 'DELETE',
        body: {
          remove_reason: removeReason
        }
      })

      await reloadUser()
    }
  } catch {
  } finally {
    loading.value = false
  }
}

async function toggleMedicineState(id: number) {
  try {
    loading.value = true
    await $authFetch<Medicine>(`/medicines/${id}/state`, {
      method: 'PATCH'
    })

    await reloadUser()
  } catch {
  } finally {
    loading.value = false
  }
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
      <!-- user info card -->
      <v-col cols="12" md="4" sm="5">
        <v-card :loading="loading">
          <v-card-title>بيانات المريض</v-card-title>
          <v-card-text>
            <v-table>
              <tbody>
                <tr>
                  <td>الاسم</td>
                  <td>{{ patientUser.name }}</td>
                </tr>
                <tr>
                  <td>الجنس</td>
                  <td>
                    {{ patientUser.patient?.gender || 'غير محدد' }}
                    <v-icon v-if="patientUser.patient?.gender" @click="copy(patientUser.patient?.gender as string)"
                      >mdi-content-copy</v-icon
                    >
                  </td>
                </tr>
                <tr>
                  <td>رقم الهاتف</td>
                  <td>
                    {{ patientUser.patient?.phonenumber || 'غير محدد' }}
                    <v-icon
                      v-if="patientUser.patient?.phonenumber"
                      @click="copy(patientUser.patient?.phonenumber as string)"
                      >mdi-content-copy</v-icon
                    >
                  </td>
                </tr>
                <tr>
                  <td>البريد الالكتروني</td>
                  <td>{{ patientUser.email }} <v-icon @click="copy(patientUser.email)">mdi-content-copy</v-icon></td>
                </tr>
                <tr>
                  <td>الرقم التسلسلي</td>
                  <td>
                    {{ patientUser.patient?.id }}
                    <v-icon @click="copy(patientUser.patient?.id.toString())">mdi-content-copy</v-icon>
                  </td>
                </tr>
                <tr>
                  <td>تاريخ الميلاد</td>
                  <td>{{ patientUser.patient?.birthdate }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-btn block variant="flat" color="success">بدا محادثة</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <!-- user actions -->
      <v-col cols="12" md="8" sm="7">
        <v-card :loading="loading">
          <v-tabs v-model="tab" mandatory>
            <v-tab value="medicines">ادارة الادوية</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="medicines">
                <v-card-title v-if="medicines.length > 0">الادوية</v-card-title>
                <v-table v-if="medicines.length > 0">
                  <thead>
                    <tr>
                      <th>اسم الدواء</th>
                      <th>تاريخ الاضافة</th>
                      <th>بواسطة الطبيب الحالي؟</th>
                      <th>سبب الاضافة</th>
                      <th>الحالة</th>
                      <th>الاجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="medicine in medicines">
                      <td>{{ medicine.name }}</td>
                      <td>{{ $formatters.formatDate(medicine.created_at).value }}</td>
                      <td>{{ medicine.doctor_id === $authStore.user?.id ? 'نعم' : 'لا' }}</td>
                      <td>{{ medicine.reason }}</td>
                      <td>
                        <v-chip :color="chipColor(medicine.state)">{{ chipState(medicine.state) }}</v-chip>
                      </td>
                      <td>
                        <v-btn
                          v-if="medicine.state !== 'deleted'"
                          class="mx-1"
                          icon="mdi-delete"
                          @click="removeMedicine(medicine.id)"
                          variant="flat"
                          density="comfortable"
                          color="error"></v-btn>

                        <v-btn
                          v-if="medicine.state !== 'deleted'"
                          class="mx-1"
                          @click="toggleMedicineState(medicine.id)"
                          variant="flat"
                          density="comfortable"
                          :icon="medicine.state === 'suspended' ? 'mdi-play' : 'mdi-pause'"
                          :color="medicine.state === 'suspended' ? 'green' : 'blue'">
                        </v-btn>
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
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-title>الاجراءات</v-card-title>
          <v-card-actions>
            <div v-if="tab === 'appointments'">
              <v-btn variant="flat" color="warning">حجز موعد</v-btn>
            </div>
            <div v-else-if="tab === 'medicines'">
              <dialogs-add-medicine @@updated="reloadUser" :patient_id="patientUser.patient?.id as number" />
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
