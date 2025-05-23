<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700 relative">
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
        {{ $t('register.title') }}
      </h2>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <BaseInput v-model="name" type="text" :placeholder="$t('register.name')" required />
        <BaseInput v-model="email" type="email" :placeholder="$t('register.email')" required />
        <BaseInput v-model="password" type="password" :placeholder="$t('register.password')" required />
        <BaseButton
          type="submit"
          bgColor="bg-indigo-500"
          hoverColor="hover:bg-indigo-600"
          @click="submitForm"
        >
          {{ $t('register.submit') }}
        </BaseButton>
        <router-link
          to="/login"
          class="block text-center text-sm mt-2 text-indigo-500 hover:text-indigo-600 underline"
        >
          {{ $t('register.loginLink') }}
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { API_BASE } from '../config/api.js'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const { locale, t } = useI18n()

function toggleLanguage() {
  locale.value = locale.value === 'pt' ? 'en' : 'pt'
}

async function handleRegister() {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value,
    }),
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

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
.btn {
  width: 100%;
  background: #4f46e5;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
}
</style>