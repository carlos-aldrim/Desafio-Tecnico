<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <NavBar />
    <div class="flex flex-col items-center py-10 px-4">
      <h2 class="text-4xl font-extrabold text-white mb-10 drop-shadow-lg">
        {{ t('videos.title') }}
      </h2>

      <VideoList :videos="paginatedVideos" :showAdminActions="auth.user?.role === 'admin'" @delete="deleteVideo" />

      <PaginationControls
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="currentPage--"
        @next="currentPage++"
      />
    </div>

    <button
      v-if="auth.user?.role === 'admin'"
      @click="$router.push('/videos/novo')"
      class="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white text-3xl rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition"
      :title="t('videos.newVideo')"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import NavBar from '../components/NavBar.vue'
import VideoList from '../components/VideoList.vue'
import PaginationControls from '../components/PaginationControls.vue'
import { API_BASE } from '../config/api.js'

const { t } = useI18n()
const auth = useAuthStore()
const videos = ref([])
const currentPage = ref(1)
const pageSize = 4

const fetchVideos = async () => {
  try {
    const response = await fetch(`${API_BASE}/videos`)
    if (!response.ok) throw new Error(t('videos.fetchError'))
    const data = await response.json()
    videos.value = data
  } catch (error) {
    console.error(t('videos.fetchError'), error)
  }
}

const deleteVideo = async (id) => {
  if (!confirm(t('videos.confirmDelete'))) return
  try {
    const response = await fetch(`${API_BASE}/videos/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error(t('videos.deleteFail'))
    videos.value = videos.value.filter(video => video.id !== id)
    if (paginatedVideos.value.length === 0 && currentPage.value > 1) currentPage.value--
  } catch {
    alert(t('videos.deleteFail'))
  }
}

onMounted(fetchVideos)

const totalPages = computed(() => Math.ceil(videos.value.length / pageSize))
const paginatedVideos = computed(() =>
  videos.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)
</script>
