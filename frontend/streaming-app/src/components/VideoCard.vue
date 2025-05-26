<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
  video: Object,
  showAdminActions: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])
</script>

<template>
  <div @click="$router.push(`/videos/${video.id}`)"
    class="video-card bg-white bg-opacity-90 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 relative overflow-hidden">
    <div class="flex flex-col sm:items-right sm:gap-6 flex-1 overflow-hidden">
      <h3 class="text-lg sm:text-xl font-semibold text-indigo-900 truncate max-w-full" :title="video.title">
        {{ video.title }}
      </h3>
      <p class="text-gray-700 sm:text-sm truncate max-w-full" :title="video.description">
        Descrição: {{ video.description }}
      </p>
    </div>

    <div class="flex justify-center items-center sm:flex-row gap-4 flex-wrap sm:flex-nowrap shrink-0 flex-col">
      <span
        class="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap select-none">
        {{ t('videos.category') }}: {{ video.category.name }}
      </span>
      <a :href="video.url" target="_blank" class="text-indigo-600 font-semibold underline text-sm hover:text-indigo-800"
        @click.stop>
        {{ t('videos.watch') }}
      </a>
    </div>

    <div v-if="showAdminActions" class="flex justify-center items-center gap-1 shrink-0">
      <button @click.stop="$router.push(`/videos/editar/${video.id}`)" :title="t('videos.edit')"
        class="text-indigo-600 hover:text-indigo-800 font-bold text-ml p-1 rounded-full transition">
        ✎
      </button>
      <button @click.stop="$emit('delete', video.id)" :title="t('videos.delete')"
        class="text-red-600 hover:text-red-800 font-bold text-xl p-1 rounded-full transition">
        ×
      </button>
    </div>
  </div>
</template>
