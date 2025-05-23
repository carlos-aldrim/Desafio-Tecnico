<template>
  <AuthLayout>
    <LanguageToggle />
    <AuthFormContainer>
      <h2 class="text-3xl sm:text-4xl text-center mb-8 font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ t('login.title') }}
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <BaseInput required v-model="email" type="email" :placeholder="t('login.emailPlaceholder') + '@email.com'"  />
        <BaseInput required v-model="password" type="password" :placeholder="t('login.passwordPlaceholder')" />

        <button
          type="submit"
          class="w-full bg-indigo-500 text-white py-3 rounded-md text-lg hover:bg-indigo-600 transition"
          :disabled="loading"
        >
          <span v-if="!loading">{{ t('login.button') }}</span>
          <span v-else class="animate-spin inline-block h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
        </button>
      </form>

      <router-link to="/register" class="block text-center text-sm mt-6 text-indigo-500 hover:text-indigo-600 underline">
        {{ t('login.registerLink') }}
      </router-link>
    </AuthFormContainer>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'

import BaseInput from '../components/BaseInput.vue'
import AuthLayout from '../components/AuthLayout.vue'
import AuthFormContainer from '../components/AuthFormContainer.vue'
import LanguageToggle from '../components/LanguageToggle.vue'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

async function handleLogin() {
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    alert(t('login.error') + ': ' + error)
  } finally {
    loading.value = false
  }
}
</script>
