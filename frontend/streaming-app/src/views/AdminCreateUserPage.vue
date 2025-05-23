<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 class="text-3xl sm:text-4xl mb-6 font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ t('adminCreateUser.title') }}
      </h2>

      <CreateUserForm />

      <button
        @click="router.push('/admin')"
        class="inline-flex items-center gap-2 px-4 py-2 mt-6 text-indigo-600 hover:underline hover:rounded-lg text-sm font-medium transition duration-300 ease-in-out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('adminCreateUser.backToPanel') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CreateUserForm from '../components/CreateUserForm.vue'

const router = useRouter()
const { t } = useI18n()
</script>
