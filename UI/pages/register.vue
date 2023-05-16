<script setup lang="ts">
import { useAuthStore } from '~~/stores'

const { t } = useI18n()
const $authStore = useAuthStore()

definePageMeta({
  layout: 'auth-layout'
})

const form = reactive({
  name: '',
  email: '',
  password: '',
  isDoctor: false,
  birthdate: '',
  specialty: ''
})

const rules = {
  name: [(v: string) => !!v || t('errors.validation.required')],
  email: [
    (v: string) => !!v || t('errors.validation.required'),
    (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || t('errors.validation.invalid')
  ],
  password: [
    (v: string) => !!v || t('errors.validation.required'),
    (v: string) => v.length > 8 || t('errors.validation.shorter')
  ],
  birthdate: [(v: string) => !!v || t('errors.validation.required')],
  specialty: [(v: string) => !!v || t('errors.validation.required')]
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
      await $authStore.signUp(form.name, form.email, form.password, form.isDoctor, form.birthdate, form.specialty)
    } catch (error: any) {
      const errors = error.response._data.errors as { rule: string; field: string; message: string }[]
      console.log(errors)
      errors.forEach((error) => {
        if (error.field === 'email' && error.rule === 'unique') {
          feedback.text = 'البريد الالكتروني مستخدم من قبل'
          feedback.title = 'خطأ اثناء انشاء الحساب'
          feedback.type = 'error'
          feedback.show = true
        }
      })
    }
  }

  loading.value = false
}
</script>

<template>
  <v-img height="300" gradient="to top right,  #00000080, #00FF001c" cover src="/images/auth-layout-background.jpg">
    <v-container class="fill-height">
      <v-row justify="start">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card :loading="loading" :disabled="loading" variant="flat" elevation="12">
            <v-toolbar>
              <v-toolbar-title>{{ $t('views.register.register') }}</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-alert
                v-if="feedback.show"
                :type="feedback.type"
                :title="feedback.title"
                :text="feedback.text"></v-alert>
              <v-form ref="formRef" validate-on="input">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  class="my-3"
                  label="الاسم"
                  type="text"
                  required
                  id="name"
                  name="name"
                  prepend-inner-icon="mdi-account"
                  v-model="form.name"
                  :rules="rules.name" />

                <v-text-field
                  variant="outlined"
                  density="compact"
                  class="my-3"
                  :label="$t('views.login.email')"
                  type="email"
                  required
                  id="email"
                  name="email"
                  v-model="form.email"
                  :rules="rules.email"
                  prepend-inner-icon="mdi-email" />
                <v-text-field
                  variant="outlined"
                  density="compact"
                  class="my-3"
                  :label="$t('views.login.password')"
                  type="password"
                  required
                  id="password"
                  name="password"
                  v-model="form.password"
                  :rules="rules.password"
                  prepend-inner-icon="mdi-key" />

                <v-checkbox v-model="form.isDoctor" label="هذا حساب طبيب" />

                <v-text-field
                  v-if="form.isDoctor"
                  variant="outlined"
                  density="compact"
                  class="my-3"
                  label="التخصص"
                  type="text"
                  required
                  id="specialty"
                  name="specialty"
                  v-model="form.specialty"
                  :rules="rules.specialty" />

                <v-text-field
                  v-else
                  variant="outlined"
                  density="compact"
                  class="my-3"
                  label="تاريخ الميلاد"
                  type="date"
                  required
                  id="birthdate"
                  name="birthdate"
                  v-model="form.birthdate"
                  :rules="rules.birthdate" />
              </v-form>
              <p>لديك حساب بالفعل؟ <NuxtLink to="/login">سجل دخول</NuxtLink></p>
            </v-card-text>
            <v-card-actions>
              <v-btn block variant="elevated" elevation="12" @click="submit" class="my-3">{{
                $t('views.register.register')
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>
