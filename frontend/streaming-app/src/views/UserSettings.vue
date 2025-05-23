<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700 flex items-center justify-center px-4">
    <div
      class="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-lg animate-fadeSlideUp flex flex-col items-center text-center space-y-6"
    >
      <h2 class="text-3xl sm:text-4xl mb-4 font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ $t('settings.title') }}
      </h2>

      <div class="w-full space-y-4">
        <BaseButton
          @click="router.push('/editar')"
          bgColor="bg-indigo-500"
          hoverColor="hover:bg-indigo-600"
        >
          {{ $t('settings.edit') }}
        </BaseButton>

        <BaseButton
          @click="handleDelete"
          bgColor="bg-purple-500"
          hoverColor="hover:bg-purple-600"
        >
          {{ $t('settings.delete') }}
        </BaseButton>

        <BaseButton
          @click="handleLogout"
          bgColor="bg-blue-700"
          hoverColor="hover:bg-blue-800"
        >
          {{ $t('settings.logout') }}
        </BaseButton>
      </div>

      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 px-4 py-2 mt-6 text-indigo-600 hover:underline hover:rounded-lg text-sm font-medium transition duration-300 ease-in-out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ $t('settings.back') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../components/BaseButton.vue'
import { useI18n } from 'vue-i18n'
import { API_BASE } from '../config/api.js'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

async function handleDelete() {
  if (!confirm(t('settings.confirmDelete'))) return

  const res = await fetch(`${API_BASE}/users/${authStore.user.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authStore.token}` },
  })

  if (res.ok) {
    alert(t('settings.deleted'))
    authStore.logout()
    router.push('/login')
  } else {
    const err = await res.json()
    alert(err.error)
  }
}
</script>

<style scoped>
@keyframes fadeSlideUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeSlideUp {
  animation: fadeSlideUp 0.5s ease forwards;
}
</style>