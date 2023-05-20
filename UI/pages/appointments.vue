<script setup lang="ts">
import { Appointment } from '~~/types'
import { Patient } from '~~/types'

const $authFetch = useFetchAuth()

const appointments = ref(await $authFetch<Appointment[]>('/appointments', { method: 'GET' }))

const itemsPerPage = 10
const headers = [
  { title: 'المريض' },
  { title: 'التاريخ' },
  { title: 'الرسالة' },
  { title: 'مقبول' },
  { title: 'أجراءات' }
]

const loading = ref(false)

function accept(item) {
  $authFetch(`/appointments/${item.value.id}`, { method: 'PATCH' })
}

const $formatters = useFormatters()
</script>

<template>
  <v-container>
    <!-- data table -->
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-data-table
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="appointments"
          variant="flat"
          locales="ar"
          item-value="name"
          class="elevation-1">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.value.patient.user.name }}</td>
              <td>{{ $formatters.formatDateTime(item.value.start_time).value || 'غير محدد' }}</td>
              <td>{{ item.value.message || 'غير محدد' }}</td>
              <td>{{ item.value.accepted ? 'مقبول' : 'غير مقبول' }}</td>
              <td>
                <v-btn variant="flat" @click="accept(item)"><v-icon class="ml-3">mdi-check</v-icon> قبول </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
