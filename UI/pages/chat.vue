<script setup lang="ts">
import { User } from '~/types'

const user = useCurrentUser()

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
const messagesContainer = ref(null)

for (let i = 0; i < 10; i++) {
  onMessageReceived({
    date: new Date(),
    sender: user,
    text: 'message.value',
    seen: false,
    mine: Math.random() > 0.8,
    id: messages.value.length
  })
}
function sendMessage() {
  // send the message

  onMessageSent()
}
function onMessageSent() {
  messages.value.push({
    date: new Date(),
    sender: user,
    text: message.value,
    seen: false,
    mine: true,
    id: messages.value.length
  })
  message.value = ''

  if (messagesContainer.value) {
    setTimeout(() => {
      // @ts-ignore
      messagesContainer.value.scroll(0, messagesContainer.value.scrollHeight + 1000)
    }, 1)
  }
}
function onMessageReceived(message: IMessage) {
  messages.value.push(message)
}
function onMessageSeen(id: number) {
  for (let i = 0; i < messages.value.length; i++) {
    if (messages.value[i].id === id) messages.value[i].seen = true
  }
}
function onStartTyping() {
  isTyping.value = true
}
function onFinishTyping() {
  isTyping.value = false
}
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
                <VTextField v-model="message" @keydown.enter="sendMessage" label="اكتب الرسالة"></VTextField>
              </v-col>
            </v-row>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
