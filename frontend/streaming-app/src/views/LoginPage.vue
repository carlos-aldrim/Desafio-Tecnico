<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-pink-500">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-3xl font-extrabold mb-8 text-center text-gray-800">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            placeholder="seu.email@exemplo.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="password" class="block text-gray-700 font-semibold mb-2">Senha</label>
          <input
            v-model="password"
            id="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
          :disabled="loading"
        >
          <span v-if="!loading">Entrar</span>
          <span v-else class="animate-spin inline-block h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    alert('Falha no login: ' + error)
  } finally {
    loading.value = false
  }
}
</script>
