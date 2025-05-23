<template>
  <div
    @click="$router.push(`/videos/${video.id}`)"
    class="video-card bg-white bg-opacity-90 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
  >
    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-6 flex-1">
      <h3 class="text-lg sm:text-xl font-semibold text-indigo-900 truncate">
        {{ video.title }}
      </h3>
      <p class="text-gray-700 text-sm line-clamp-2 sm:line-clamp-1 max-w-xs sm:max-w-md">
        {{ video.description }}
      </p>
    </div>
    <div class="flex items-center gap-4 flex-wrap sm:flex-nowrap">
      <span
        class="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap select-none"
      >
        {{ $t('category.label') }}: {{ categoryName }}
      </span>
      <a
        :href="video.url"
        target="_blank"
        class="text-indigo-600 font-semibold underline text-sm hover:text-indigo-800"
      >
        {{ $t('category.watch') }}
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  video: Object,
  categoryName: String,
})
</script>

<style scoped>
.video-card {
  animation: fadeSlideUp 0.5s ease forwards;
}
</style>
