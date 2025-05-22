<template>
  <nav class="flex justify-between items-center bg-white px-6 py-4 shadow">
    <h1 class="text-xl font-bold text-gray-700">Streaming App</h1>

    <div class="flex items-center space-x-4">
      <button
        @click="router.push('/')"
        class="text-indigo-500 font-medium hover:text-indigo-600 underline"
      >
        {{ $t('navbar.home') }}
      </button>

      <button
        @click="router.push('/videos')"
        class="text-indigo-500 font-medium hover:text-indigo-600 underline"
      >
        {{ $t('navbar.videos') }}
      </button>

      <button
        @click="router.push('/categorias')"
        class="text-indigo-500 font-medium hover:text-indigo-600 underline"
      >
        {{ $t('navbar.categories') }}
      </button>

      <button
        @click="router.push('/usuario')"
        class="text-indigo-500 font-medium hover:text-indigo-600 underline"
      >
        {{ $t('navbar.user') }}
      </button>

      <button
        v-if="auth.user?.role === 'admin'"
        @click="router.push('/admin')"
        class="text-indigo-500 font-medium hover:text-indigo-600 underline"
      >
        {{ $t('navbar.admin') }}
      </button>

      <button @click="toggleLanguage" class="ml-2">
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
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const auth = useAuthStore()

const { locale } = useI18n()

function toggleLanguage() {
  locale.value = locale.value === 'pt' ? 'en' : 'pt'
}
</script>