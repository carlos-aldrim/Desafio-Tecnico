<script setup>
import VideoCard from './VideoCard.vue'

defineProps({
  videos: Array,
  showAdminActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete'])

const onDelete = (id) => {
  emit('delete', id)
}
</script>

<template>
  <div class="grid gap-4 w-full max-w-4xl">
    <VideoCard
      v-for="video in videos"
      :key="video.id"
      :video="video"
      :showAdminActions="showAdminActions"
      @delete="onDelete"
    />
  </div>
</template>
