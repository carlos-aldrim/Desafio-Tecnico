<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <NavBar />
    <div class="flex flex-col items-center py-10 px-4">
      <h2 class="text-4xl font-extrabold text-white mb-10 drop-shadow-lg">
        {{ t('videos.title') }}
      </h2>

      <div class="grid gap-4 w-full max-w-4xl">
        <div
          v-for="video in paginatedVideos"
          :key="video.id"
          @click="$router.push(`/videos/${video.id}`)"
          class="video-card bg-white bg-opacity-90 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-row justify-between gap-3 relative"
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
            <span class="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap select-none">
              {{ t('videos.category') }}: {{ video.category.name }}
            </span>
            <a
              :href="video.url"
              target="_blank"
              class="text-indigo-600 font-semibold underline text-sm hover:text-indigo-800"
              @click.stop
            >
              {{ t('videos.watch') }}
            </a>
          </div>

          <div v-if="auth.user?.role === 'admin'" class="flex justify-center items-center">
            <button
              @click.stop="$router.push(`/videos/editar/${video.id}`)"
              :title="t('videos.edit')"
              class="text-indigo-600 hover:text-indigo-800 font-bold text-ml leading-none ml-1 p-1 rounded-full transition"
            >
              ✎
            </button>
            <button
              @click.stop="deleteVideo(video.id)"
              :title="t('videos.delete')"
              class="text-red-600 hover:text-red-800 font-bold text-xl leading-none ml-1 p-1 rounded-full transition"
              style="cursor: pointer;"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex space-x-6">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ t('videos.previous') }}
        </button>
        <button
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
          class="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ t('videos.next') }}
        </button>
      </div>
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
import NavBar from '../components/NavBar.vue'
import { useAuthStore } from '../stores/auth.js'
import { useI18n } from 'vue-i18n'
import { API_BASE } from '../config/api.js'

const { t } = useI18n()

const videos = ref([])
const currentPage = ref(1)
const pageSize = 4
const auth = useAuthStore()

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
    const response = await fetch(`${API_BASE}/videos/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(t('videos.deleteFail'))
    }

    videos.value = videos.value.filter(video => video.id !== id)

    if (paginatedVideos.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

  } catch (error) {
    console.error(error)
    alert(t('videos.deleteFail'))
  }
}

onMounted(fetchVideos)

const totalPages = computed(() => Math.ceil(videos.value.length / pageSize))
const paginatedVideos = computed(() =>
  videos.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 640px) {
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

h2 {
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

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

.video-card {
  animation: fadeSlideUp 0.5s ease forwards;
  position: relative;
}
</style>