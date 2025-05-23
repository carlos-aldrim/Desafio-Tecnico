<template>
  <AuthLayout>
    <LanguageToggle />
    <AuthFormContainer>
      <h2 class="text-3xl sm:text-4xl text-center mb-8 font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ t('register.title') }}
      </h2>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <BaseInput v-model="name" type="text" :placeholder="t('register.name')" required />
        <BaseInput v-model="email" type="email" :placeholder="t('register.email')" required />
        <BaseInput v-model="password" type="password" :placeholder="t('register.password')" required />

        <BaseButton type="submit" bgColor="bg-indigo-500" hoverColor="hover:bg-indigo-600">
          {{ t('register.submit') }}
        </BaseButton>

        <router-link to="/login" class="block text-center text-sm mt-2 text-indigo-500 hover:text-indigo-600 underline">
          {{ t('register.loginLink') }}
        </router-link>
      </form>
    </AuthFormContainer>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { API_BASE } from '../config/api.js'

import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import AuthLayout from '../components/AuthLayout.vue'
import AuthFormContainer from '../components/AuthFormContainer.vue'
import LanguageToggle from '../components/LanguageToggle.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const { t } = useI18n()

async function handleRegister() {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
  })

  if (!res.ok) {
    const err = await res.json()
    alert(err.error)
    return
  }

  alert(t('register.success'))
  router.push('/login')
}
</script>
