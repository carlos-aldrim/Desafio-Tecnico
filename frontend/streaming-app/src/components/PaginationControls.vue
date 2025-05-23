<template>
  <div class="mt-8 flex space-x-6">
    <button
      :disabled="currentPage === 1"
      @click="$emit('prev')"
      class="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {{ t('videos.previous') }}
    </button>
    <button
      :disabled="currentPage >= totalPages"
      @click="$emit('next')"
      class="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {{ t('videos.next') }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
defineProps(['currentPage', 'totalPages'])
const { t } = useI18n()
</script>
