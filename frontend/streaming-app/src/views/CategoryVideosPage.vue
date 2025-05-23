<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <NavBar />
    <div class="flex flex-col items-center py-10 px-4">
      <h2 class="text-4xl font-extrabold text-white mb-10 drop-shadow-lg">
        {{ $t('category.title') }}: {{ categoryName }}
      </h2>

      <div class="grid gap-4 w-full max-w-4xl">
        <CategoryVideoCard
          v-for="video in paginatedVideos"
          :key="video.id"
          :video="video"
          :categoryName="categoryName"
        />
        <p v-if="paginatedVideos.length === 0" class="text-white text-center mt-4">
          {{ $t('category.none') }}
        </p>
      </div>

      <PaginationControls
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="currentPage > 1 ? currentPage-- : null"
        @next="currentPage < totalPages ? currentPage++ : null"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import CategoryVideoCard from '../components/CategoryVideoCard.vue'
import PaginationControls from '../components/PaginationControls.vue'
import { API_BASE } from '../config/api.js'

const route = useRoute()
const categoryId = ref(route.params.id)
const categoryName = ref('')
const videos = ref([])
const currentPage = ref(1)
const pageSize = 4

const fetchCategoryWithVideos = async () => {
  try {
    const res = await fetch(`${API_BASE}/categories/${categoryId.value}`)
    if (!res.ok) throw new Error('Erro na resposta da API')

    const categoryData = await res.json()
    categoryName.value = categoryData.name
    videos.value = categoryData.videos || []
  } catch (error) {
    console.error('Erro ao carregar categoria e vídeos:', error)
    categoryName.value = ''
    videos.value = []
  }
}

onMounted(fetchCategoryWithVideos)

watch(
  () => route.params.id,
  (newId) => {
    categoryId.value = newId
    currentPage.value = 1
    fetchCategoryWithVideos()
  }
)

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
</style>
