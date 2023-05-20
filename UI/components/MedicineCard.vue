<template>
  <v-card border class="mx-auto medicine-card" :key="componentKey" :loading="loading">
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
          :key="dosageTime.color"
          :dot-color="dosageTime.color"
          size="x-small">
          <template v-slot:opposite>
            <v-btn
              :disabled="dosageTime.color === 'green' || dosageTime.color === 'grey'"
              @click="take(dosageTime)"
              :color="dosageTime.color"
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

const http = useFetchAuth()

export interface MedicineCardProps {
  medicine: Medicine
}
export interface MedicineCardEmits {
  (e: 'reload'): void
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
const $emit = defineEmits<MedicineCardEmits>()

const componentKey = ref(0)
const takenDoses = useLocalStorage('taken-doeses', [] as TakenDose[])
const loading = ref(false)
function getTimeString({ hours, minutes }: Dose) {
  const ampm = hours >= 12 ? 'مساءً' : 'صباحا'
  return `${hours % 12}:${minutes} ${ampm}`
}

function take(dose: Dose) {
  if (!takenDoses.value.find(({ dose: _dose }) => _dose.hours === dose.hours && _dose.minutes === dose.minutes)) {
    loading.value = true
    http(`/medicines/${$props.medicine.id}`, { method: 'PATCH' }).then(() => {
      takenDoses.value.push({
        dose,
        medicineID: $props.medicine.id,
        takenAt: new Date(),
        userID: $props.medicine.patient_id
      })
      loading.value = false
      $emit('reload')
    })
  }
}

const doses = computed(() => {
  const d: Dose[] = $props.medicine.frequency_settings.doses

  // add the color
  if (Array.isArray(d)) {
    const now = new Date()
    takenDoses.value = takenDoses.value.filter(({ takenAt }) => now.getUTCDay() === new Date(takenAt).getUTCDay())

    const dosesWithBadgeColor: ({ color: 'error' | 'grey' | 'green' } & Dose)[] = d.map((_dose) => {
      if (takenDoses.value.find(({ dose }) => dose.hours === _dose.hours && dose.minutes === _dose.minutes))
        return { color: 'green', ..._dose }
      if (now.getHours() - _dose.hours > 0) return { color: 'error', ..._dose }
      return { color: 'grey', ..._dose }
    })

    dosesWithBadgeColor.sort((a, b) => {
      return a.hours - b.hours
    })
    return dosesWithBadgeColor
  }
  return []
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
