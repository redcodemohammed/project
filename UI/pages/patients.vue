<script setup lang="ts">
import { Patient } from '~~/types'

const $authFetch = useFetchAuth()
const $snackbar = useSnackbar()

const patientsValue = await $authFetch<Patient[]>('/auth/patients', { method: 'GET' })

const patients = ref(patientsValue)

const itemsPerPage = 10
const headers = [{ title: 'الاسم' }, { title: 'الجنس' }, { title: 'رقم الهاتف' }, { title: 'أجراءات' }]

const addPatientDialog = ref(false)
const loading = ref(false)
const form = reactive({
  patientID: ''
})

async function addPatient() {
  loading.value = true
  try {
    await $authFetch('/auth/patients', { method: 'PATCH', body: form })
    patients.value = await $authFetch<Patient[]>('/auth/patients', { method: 'GET' })
  } catch {
    $snackbar.show({ message: 'حدث خطا اثناء اضافة المريض, حاول مرة اخرى', show: true, timeout: 3000 })
  } finally {
    loading.value = false
    form.patientID = ''
    addPatientDialog.value = false
  }
}
</script>

<template>
  <v-container>
    <!-- data table -->
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card variant="flat">
          <v-toolbar elevation="2">
            <v-dialog v-model="addPatientDialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" variant="elevated" class="mb-2" v-bind="props">
                  <v-icon>mdi-plus</v-icon> اضافة مريض
                </v-btn>
              </template>
              <v-card :loading="loading" :disabled="loading">
                <v-card-title>
                  <span class="text-h5">اضافة مريض</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-form @submit.prevent="addPatient">
                          <v-text-field
                            v-model="form.patientID"
                            inputmode="numeric"
                            type="number"
                            regex
                            label="رقم المريض التسلسلي"
                            density="compact"></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="green-darken-1" @click="addPatient" variant="elevated"> اضافة </v-btn>
                  <v-btn color="blue-darken-1" @click="addPatientDialog = false" variant="text"> الغاء </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-card-text>
            <v-alert
              v-if="patients.length <= 0"
              type="info"
              title="لا يوجد مرضى حالياً"
              text="يبدو ان حساب الطبيب هذا غير مرتبط باي حساب مريض استخدم زر الاضافة لاضافة مريض جديد"
              variant="tonal"></v-alert>
            <v-data-table
              v-else
              variant="flat"
              locales="ar"
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="patients"
              item-value="name"
              class="elevation-1">
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.value.user.name }}</td>
                  <td>{{ item.gender || 'غير محدد' }}</td>
                  <td>{{ item.phonenumber || 'غير محدد' }}</td>
                  <td>
                    <v-btn variant="flat" :to="{ name: 'patient-id', params: { id: item.value.user.id } }"
                      ><v-icon class="ml-3">mdi-eye</v-icon> عرض
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
