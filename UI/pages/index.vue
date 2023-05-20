<script setup lang="ts">
import { UserType } from '~~/enums'
import { useAuthStore } from '~~/stores'
import { Medicine } from '~~/types'

const $authStore = useAuthStore()
const $route = useRoute()
const $authFetch = useFetchAuth()
const $snackbar = useSnackbar()
const $formatters = useFormatters()

// if the user is patient then fetch the today's medicines list
const todaysMedicines = ref<Medicine[]>([])
if ($authStore.user?.user_type === UserType.Patient) {
  await loadMedicines()
}

async function loadMedicines() {
  todaysMedicines.value = await $authFetch<Medicine[]>(`/medicines/today`, { method: 'GET' })
}
</script>
<template>
  <v-container>
    <v-row justify="start" v-if="$authStore.user?.user_type === UserType.Patient">
      <v-col cols="12" sm="6" lg="3" v-for="medicine in todaysMedicines">
        <MedicineCard @reload="loadMedicines" :medicine="medicine"></MedicineCard>
      </v-col>
      <v-col>
        <v-alert
          v-if="todaysMedicines.length === 0"
          type="info"
          title="لا توجد ادوية"
          text="المريض ليس لديه ادوية حاليا, يمكنك اضافة دواء جديد من قائمة الاجراءات"
          variant="tonal"></v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
