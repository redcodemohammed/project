<template>
  <v-card border class="mx-auto medicine-card" :key="componentKey">
    <v-card-title>
      {{ medicine.name }}
    </v-card-title>

    <v-card-text>
      <v-card-subtitle> جرع اليوم </v-card-subtitle>

      <v-divider class="my-4"></v-divider>
      <div justify="center" class="ma-12" v-show="componentKey === 0">
        <v-progress-circular color="success" indeterminate></v-progress-circular>
      </div>
      <v-timeline v-show="componentKey > 0" class="ma-2" align="start" truncate-line="start">
        <v-timeline-item
          v-for="dosageTime in doses"
          :key="dosageTime"
          :dot-color="timeLineChipColor(dosageTime)"
          size="x-small">
          <template v-slot:opposite>
            <v-btn
              :disabled="timeLineChipColor(dosageTime) === 'green' || timeLineChipColor(dosageTime) === 'grey'"
              @click="take(dosageTime)"
              :color="timeLineChipColor(dosageTime)"
              >تناول</v-btn
            >
          </template>
          <div class="font-weight-normal mb-4">
            <span>{{ medicine.dosage }} حبة</span> في
            {{ getTimeString(dosageTime) }}
          </div>
        </v-timeline-item>
      </v-timeline>

      <v-divider class="my-4"></v-divider>

      <v-list>
        <v-list-item>
          <v-list-item-subtitle>
            <v-progress-linear
              height="25"
              class="text-white"
              :color="(medicine.quantity / medicine.full_quantity) * 100 > 50 ? 'success' : 'warning'"
              :model-value="(medicine.quantity / medicine.full_quantity) * 100"
              >الكمية المتبقية {{ medicine.quantity }}
            </v-progress-linear>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <div>
        <v-col cols="12" sm="6">
          <span>الطبيب </span>
          <strong>{{ medicine?.doctor?.user?.name }}</strong>
        </v-col>
        <v-col cols="12" sm="6">
          <span>التخصص </span>
          <strong>{{ medicine?.doctor?.specialty }}</strong>
        </v-col>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { Medicine } from '~~/types'

export interface MedicineCardProps {
  medicine: Medicine
}

export interface Dose {
  hours: number
  minutes: number
  seconds: number
}

export interface TakenDose {
  dose: Dose
  takenAt: Date
  medicineID: number
  userID: number
}

const $props = defineProps<MedicineCardProps>()

// const completePercentage = computed(() => {
//   const MS_IN_DAYS = 1000 * 60 * 60 * 24
//   const { start_date, end_date } = $props.medicine
//   const startDate = new Date(start_date)
//   const endDate = new Date(end_date)
//   const today = new Date()

//   const daysSinceStarted = (today.getTime() - startDate.getTime()) / MS_IN_DAYS
//   const durationInDays = (endDate.getTime() - startDate.getTime()) / MS_IN_DAYS

//   return `${(daysSinceStarted / durationInDays) * 100}%`
// })

// const remainingPercentage = computed(() => {
//   return '85%'
// })
const componentKey = ref(0)
const takenDoses = useLocalStorage('taken-doeses', [] as TakenDose[])
function timeLineChipColor({ hours, minutes }: Dose) {
  const now = new Date()
  if (takenDoses.value.find(({ dose }) => dose.hours === hours && dose.minutes === minutes)) return 'green'
  if (now.getHours() - hours > 0) return 'error'
  return 'grey'
}

function getTimeString({ hours, minutes }: Dose) {
  const ampm = hours >= 12 ? 'مساءً' : 'صباحا'
  return `${hours % 12}:${minutes} ${ampm}`
}

function take(dose: Dose) {
  if (!takenDoses.value.find(({ dose: _dose }) => _dose.hours === dose.hours && _dose.minutes === dose.minutes))
    takenDoses.value.push({
      dose,
      medicineID: $props.medicine.id,
      takenAt: new Date(),
      userID: $props.medicine.patient_id
    })
  componentKey.value++
}

const doses = computed(() => {
  const d = $props.medicine.frequency_settings.doses
  if (Array.isArray(d)) {
    d.sort((a: Dose, b: Dose) => {
      return a.hours - b.hours
    })
  }

  return d
})

// for some reason I need to put this here to rerender the component, other way the colors won't be right
onMounted(() => {
  componentKey.value++
})
</script>

<style scoped>
.headline {
  font-weight: bold;
}

.medicine-card {
  border-top: 3px rgb(var(--v-theme-success)) solid;
}
</style>
