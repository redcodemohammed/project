<script setup lang="ts">
import { useAuthStore } from '~~/stores'

const { t } = useI18n()
const $authStore = useAuthStore()

definePageMeta({
  layout: 'auth-layout'
})

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    (v: string) => !!v || t('errors.validation.required'),
    (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || t('errors.validation.invalid')
  ],
  password: [
    (v: string) => !!v || t('errors.validation.required'),
    (v: string) => v.length > 8 || t('errors.validation.shorter')
  ]
}
const formRef = ref()
const loading = ref(false)
const feedback = reactive({
  show: false,
  title: '',
  text: '',
  type: '' as 'success' | 'error' | undefined
})
async function submit() {
  const { valid } = await formRef.value.validate()
  if (valid) {
    feedback.show = false
    loading.value = true

    try {
      await $authStore.login(form.email, form.password)
    } catch (error: any) {
      const status = error.response.status
      console.log(status, error.response)

      if (status === 401) {
        feedback.text = 'البريد الالكتروني او كلمة المرور غير صحيحة'
        feedback.title = 'خطأ اثناء تسجيل الدخول'
        feedback.type = 'error'
        feedback.show = true
      }
    }
  }
  loading.value = false
}
</script>

<template>
  <v-img height="300" gradient="to top right,  #00000080, #00FF001c" cover src="/images/auth-layout-background.jpg">
    <v-container class="fill-height">
      <v-row justify="start">
        <v-col cols="12" sm="10" md="8" lg="4">
          <v-card :loading="loading" :disabled="loading" variant="flat" elevation="12">
            <v-toolbar>
              <v-toolbar-title>{{ $t('views.login.login') }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-alert
                v-if="feedback.show"
                :type="feedback.type"
                :title="feedback.title"
                :text="feedback.text"></v-alert>
              <v-form ref="formRef" validate-on="input">
                <VTextField
                  class="my-3"
                  :label="$t('views.login.email')"
                  type="email"
                  required
                  id="email"
                  name="email"
                  v-model="form.email"
                  :rules="rules.email"
                  prepend-inner-icon="mdi-email" />
                <VTextField
                  class="my-3"
                  :label="$t('views.login.password')"
                  type="password"
                  required
                  id="password"
                  name="password"
                  v-model="form.password"
                  :rules="rules.password"
                  prepend-inner-icon="mdi-key" />
              </v-form>
              <p>ليس لديك حساب؟ <NuxtLink to="/register">اعمل حساب جديد</NuxtLink></p>
            </v-card-text>

            <v-card-actions>
              <v-btn block variant="elevated" elevation="12" @click="submit" class="my-3">{{
                $t('views.login.login')
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>
