<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import { ar } from 'date-fns/locale'
import { Medicine } from '~~/types'

const main_dialog = ref(false)
const frequency_settings_dialog = ref(false)
interface AddMedicineProps {
  patient_id: number
}
const $props = withDefaults(defineProps<AddMedicineProps>(), {})

interface AddMedicineEmits {
  (e: '@updated'): void
}

const $emit = defineEmits<AddMedicineEmits>()

const $authFetch = useFetchAuth()
const loading = ref(false)
const formDefaultValues = {
  name: '',
  dosage: 0,
  frequency_settings: {
    start_time: '',
    end_time: '',
    doses: [] as string[]
  },
  start_date: '',
  end_date: '',
  quantity: 0,
  reason: '',
  expiry_date: '',
  patientId: $props.patient_id
}
const form = ref({
  ...formDefaultValues
})

function addDose() {
  form.value.frequency_settings.doses.push('')
}

// function createTimeObject(timeObject: { hours: number; minutes: number; seconds: number }) {
//   const dateObject = new Date()
//   dateObject.setHours(timeObject.hours)
//   dateObject.setMinutes(timeObject.minutes)
//   dateObject.setSeconds(timeObject.seconds)
//   return dateObject
// }
async function add() {
  loading.value = true
  try {
    // @ts-ignore
    // form.value.frequency_settings.start_time = createTimeObject(form.value.frequency_settings.start_time)
    // @ts-ignore
    // form.value.frequency_settings.end_time = createTimeObject(form.value.frequency_settings.end_time)

    // @ts-ignore
    // form.value.frequency_settings.doses = form.value.frequency_settings.doses.map((dose) => {
    //   // @ts-ignore
    //   return createTimeObject(dose)
    // })
    await $authFetch<Medicine>('/medicines', {
      body: form.value,
      method: 'POST'
    })
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    close()
    $emit('@updated')
  }
}
function close() {
  main_dialog.value = false
  form.value = { ...formDefaultValues }
  form.value.frequency_settings.doses = []
}

const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
</script>

<template>
  <v-dialog fullscreen v-model="main_dialog" location="center center">
    <template v-slot:activator="{ props }">
      <v-btn variant="elevated" color="info" elevation="1" v-bind="props">اضافة دواء</v-btn>
    </template>

    <v-card min-width="300px" :loading="loading" :disabled="loading">
      <v-card-title> اضافة دواء جديد </v-card-title>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field v-model="form.name" density="compact" label="اسم الدواء" />
          <v-dialog v-model="frequency_settings_dialog" width="auto" fullscreen>
            <template v-slot:activator="{ props }">
              <v-btn block variant="tonal" class="my-2 mb-4" color="info" v-bind="props">تحديد وقت الدواء</v-btn>
            </template>
            <v-card min-width="300px" :loading="loading" :disabled="loading">
              <v-card-title> اضافة دواء جديد </v-card-title>
              <v-card-text>
                <v-card-subtitle> وقت البدء </v-card-subtitle>
                <vue-date-picker
                  disable-month-year-select
                  time-picker
                  :formatLocale="ar"
                  locale="ar"
                  dark
                  :is24="false"
                  v-model="form.frequency_settings.start_time"></vue-date-picker>
                <!-- <v-text-field
                  @click="$event.target.type = 'time'"
                  @focusout="$event.target.type = 'text'"
                  class="ml-md-1"
                  density="compact"
                  label="وقت البدء"
                  v-model="form.frequency_settings.start_time" /> -->
                <v-card-subtitle> وقت الانتهاء </v-card-subtitle>
                <vue-date-picker
                  time-picker
                  :formatLocale="ar"
                  locale="ar"
                  dark
                  :is24="false"
                  v-model="form.frequency_settings.end_time"></vue-date-picker>
                <!-- <v-text-field
                  @click="$event.target.type = 'time'"
                  @focusout="$event.target.type = 'text'"
                  class="mx-md-1"
                  density="compact"
                  label="وقت الانتهاء"
                  v-model="form.frequency_settings.end_time" /> -->

                <v-divider class="mb-4"></v-divider>
                <div class="d-flex" style="align-items: baseline" v-for="(dose, i) in form.frequency_settings.doses">
                  <!-- <v-text-field
                    @click="$event.target.type = 'time'"
                    @focusout="$event.target.type = 'text'"
                    class="mx-md-1"
                    density="compact"
                    v-model="form.frequency_settings.doses[i]"
                    :label="`الجرعة ${i + 1}`" /> -->
                  <v-card-subtitle>{{ `الجرعة ${i + 1}` }}</v-card-subtitle>
                  <vue-date-picker
                    time-picker
                    :formatLocale="ar"
                    locale="ar"
                    dark
                    :is24="false"
                    v-model="form.frequency_settings.doses[i]"></vue-date-picker>
                  <v-btn
                    @click="form.frequency_settings.doses.splice(i, 1)"
                    density="compact"
                    color="red"
                    variant="text"
                    icon="mdi-delete"></v-btn>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn @click="addDose">اضافة جرعة جديدة</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <div class="d-md-flex">
            <v-text-field
              @click="$event.target.select()"
              v-model="form.dosage"
              class="ml-md-1"
              type="number"
              density="compact"
              label="الجرعة" />
            <v-text-field
              @click="$event.target.select()"
              v-model="form.quantity"
              class="mr-md-1"
              type="number"
              density="compact"
              label="الكمية المتوفرة حالياً" />
          </div>
          <div class="d-lg-flex">
            <div class="my-5 mx-1">
              <span>تاريخ البدأ</span>
              <vue-date-picker
                :formatLocale="ar"
                :day-names="daysOfWeek.map((day) => day.substring(0, 3))"
                locale="ar"
                dark
                v-model="form.start_date"></vue-date-picker>
            </div>
            <!-- <v-text-field
              @click="$event.target.type = 'date'"
              @focusout="$event.target.type = 'text'"
              class="ml-md-1"
              density="compact"
              label="تاريخ البدأ"
              v-model="form.start_date" /> -->
            <div class="my-5 mx-1">
              <!-- <v-text-field
                @click="$event.target.type = 'date'"
                @focusout="$event.target.type = 'text'"
                class="mx-md-1"
                density="compact"
                label="تاريخ الانتهاء"
                v-model="form.end_date" /> -->
              <span>تاريخ الانتهاء</span>
              <vue-date-picker
                :formatLocale="ar"
                :day-names="daysOfWeek.map((day) => day.substring(0, 3))"
                locale="ar"
                dark
                v-model="form.end_date"></vue-date-picker>
            </div>
            <div class="my-5 mx-1">
              <span>تاريخ انتهاء الصلاحية</span>
              <vue-date-picker
                :formatLocale="ar"
                :day-names="daysOfWeek.map((day) => day.substring(0, 3))"
                locale="ar"
                dark
                v-model="form.expiry_date"></vue-date-picker>
              <!-- <v-text-field
                @click="$event.target.type = 'date'"
                @focusout="$event.target.type = 'text'"
                class="mr-md-1"
                density="compact"
                label="تاريخ انتهاء الصلاحية"
                v-model="form.expiry_date" /> -->
            </div>
          </div>
          <v-textarea v-model="form.reason" density="compact" label="سبب اخذ الدواء" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="add" variant="elevated" elevation="4">اضافة</v-btn>
        <v-btn color="error" @click="close">الغاء</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
