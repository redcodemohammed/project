<script setup lang="ts">
import { User } from '~/types'
import { io, type Socket } from 'socket.io-client'
import { useAuthStore } from '~/stores'
import { quartersInYear } from 'date-fns'

const user = useCurrentUser()
const socket = ref<Socket | null>(null)
const $route = useRoute()
const $router = useRouter()
const $authStore = useAuthStore()

const { SOCKET_URL } = useRuntimeConfig().public

interface IMessage {
  text: string
  sender: User
  date: Date
  seen: boolean
  mine: boolean
  id: number
}
const message = ref('')
const messages = ref<IMessage[]>([])
const isTyping = ref(false)
let iamTyping = false
const messagesContainer = ref(null)

function sendMessage() {
  // send the message

  onMessageSent()
}
function onMessageSent() {
  const newMessage = {
    date: new Date(),
    sender: user,
    text: message.value,
    seen: false,
    mine: true,
    id: messages.value.length
  }
  messages.value.push(newMessage)
  message.value = ''
  socket.value?.emit('send-message', newMessage)
  socket.value?.emit('stopped-typing')
  iamTyping = false

  if (messagesContainer.value) {
    setTimeout(() => {
      // @ts-ignore
      messagesContainer.value.scroll(0, messagesContainer.value.scrollHeight + 1000)
    }, 1)
  }
}
function onMessageReceived(message: IMessage) {
  message.date = new Date(message.date)
  message.mine = message.sender.id === user.id
  messages.value.push(message)
  if (messagesContainer.value) {
    setTimeout(() => {
      // @ts-ignore
      messagesContainer.value.scroll(0, messagesContainer.value.scrollHeight + 1000)
    }, 1)
  }
}
function onMessageSeen(id: number) {
  for (let i = 0; i < messages.value.length; i++) {
    if (messages.value[i].id === id) messages.value[i].seen = true
  }
}

let timer = setTimeout(() => {}, 0)
function onStartTyping() {
  if (!iamTyping) socket.value?.emit('started-typing')
  iamTyping = true

  clearTimeout(timer)
  timer = setTimeout(() => {
    iamTyping = false
    socket.value?.emit('stopped-typing')
  }, 3000)
}

onMounted(() => {
  const roomID = $route.query.doctorID ? `${$route.query.doctorID}-${user.id}` : `${user.id}-${$route.query.patientID}`
  socket.value = io(`${SOCKET_URL}`, {
    auth: { token: $authStore.wsToken },
    query: {
      roomID
    }
  })

  socket.value.on('get-message', onMessageReceived)
  socket.value.on('started-typing', () => (isTyping.value = true))
  socket.value.on('stopped-typing', () => (isTyping.value = false))
  onStartTyping()
})
onBeforeUnmount(() => {
  socket.value?.disconnect()
})
</script>

<template>
  <VContainer>
    <!-- header -->
    <VRow justify="center">
      <!-- shows recent chats -->
      <!-- <VCol cols="3">
        <VCard variant="flat" border elevation="0" height="87.5vh">
          <VCardText>
      
            <VTextField prepend-inner-icon="mdi-magnify" label="بحث"></VTextField>
            <div style="overflow-y: scroll; height: 80vh">
              <VSheet class="pa-4 ma-2" color="primary" rounded="lg" v-for="i in 10"> {{ user.name }} </VSheet>
            </div>
          </VCardText>
        </VCard>
      </VCol> -->
      <!-- shows chat messages -->
      <VCol cols="12" lg="8">
        <VCard variant="flat" style="position: relative" border elevation="0" height="87.5vh">
          <VCardText>
            <div class="mx-6" v-if="isTyping">يكتب....</div>
            <v-divider class="ma-4"></v-divider>
            <!-- messages -->
            <div ref="messagesContainer" style="overflow-y: scroll; height: 70vh">
              <v-col cols="12" v-for="message in messages">
                <VSheet rounded="lg" elevation="12" :color="message.mine ? 'success' : 'primary'" class="pa-2 ma-2">
                  <h2 class="text-h6 mb-1">{{ message.sender.name }}</h2>
                  <p class="mx-4 my-1">
                    {{ message.text }}
                  </p>
                  <v-divider class="ma-1"></v-divider>
                  <v-icon v-if="message.mine">{{ message.seen ? 'mdi-check-all' : 'mdi-check' }}</v-icon>
                  {{ message.date.getHours() }}:{{ message.date.getMinutes() }}
                </VSheet>
              </v-col>
            </div>

            <!-- form -->
            <v-row justify="center" align="center" style="bottom: 0; width: 100%; position: absolute">
              <v-col cols="3" lg="1">
                <VBtn @click="sendMessage" icon="mdi-send"></VBtn>
              </v-col>
              <v-col cols="9" lg="11">
                <VTextField
                  @update:modelValue="onStartTyping"
                  v-model="message"
                  @keydown.enter="sendMessage"
                  label="اكتب الرسالة"></VTextField>
              </v-col>
            </v-row>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
