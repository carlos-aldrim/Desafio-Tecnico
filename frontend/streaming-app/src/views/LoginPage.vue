<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700 relative">

    <button
      @click="toggleLanguage"
      class="absolute top-4 right-4 ml-2"
    >
      <img
        v-if="locale === 'pt'"
        src="https://flagcdn.com/w40/br.png"
        alt="Português"
        class="w-6 h-6 rounded shadow"
      />
      <img
        v-else
        src="https://flagcdn.com/w40/us.png"
        alt="English"
        class="w-6 h-6 rounded shadow"
      />
    </button>

    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-3xl sm:text-4xl text-center mb-8 font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ $t('login.title') }}
      </h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-gray-700 font-semibold mb-2">
            {{ $t('login.emailLabel') }}
          </label>
          <BaseInput v-model="email" type="email" :placeholder="$t('login.emailPlaceholder')" />
        </div>

        <div>
          <label for="password" class="block text-gray-700 font-semibold mb-2">
            {{ $t('login.passwordLabel') }}
          </label>
          <BaseInput v-model="password" type="password" :placeholder="$t('login.passwordPlaceholder')" />
        </div>

        <button type="submit"
          class="w-full bg-indigo-500 text-white py-3 rounded-md text-lg hover:bg-indigo-600 transition"
          :disabled="loading">
          <span v-if="!loading">{{ $t('login.button') }}</span>
          <span v-else
            class="animate-spin inline-block h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
        </button>
      </form>

      <router-link to="/register"
        class="block text-center text-sm mt-6 text-indigo-500 hover:text-indigo-600 underline">
        {{ $t('login.registerLink') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseInput from '../components/BaseInput.vue'
import { useI18n } from 'vue-i18n'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const { locale, t } = useI18n()

function toggleLanguage() {
  locale.value = locale.value === 'pt' ? 'en' : 'pt'
}

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