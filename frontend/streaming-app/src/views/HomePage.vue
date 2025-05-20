<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-pink-500">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 class="text-3xl font-extrabold mb-6 text-gray-800">Bem-vindo à Home</h2>
      <p class="text-gray-600 mb-8">Você está logado com sucesso!</p>
      <button
        @click="handleLogout"
        class="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md text-lg font-semibold transition"
      >
        Sair
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
