<template>
  <button
    @click="router.push('/admin')"
    class="inline-flex items-center gap-2 px-4 py-2 mt-6 text-indigo-600 hover:underline hover:rounded-lg text-sm font-medium transition duration-300 ease-in-out"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    {{ $t('adminEditUser.backToPanel') }}
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
