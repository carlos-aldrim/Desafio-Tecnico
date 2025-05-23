<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700 pb-40">
    <NavBar />

    <div class="max-w-4xl mx-auto py-10 px-4 text-white">
      <h2 class="text-3xl font-bold mb-4">{{ video?.title }}</h2>
      <p class="mb-6">{{ video?.description }}</p>

      <div class="bg-white bg-opacity-90 rounded-xl p-6 shadow-md max-h-[500px]">
        <h3 class="text-xl font-bold text-indigo-800 mb-4">{{ $t('comments.title') }}</h3>
        <ul class="space-y-4">
          <li
            v-for="comment in paginatedComments"
            :key="comment.id"
            class="border-b pb-2 text-gray-800 video-card flex justify-between items-start"
          >
            <div>
              <strong>{{ comment.user.name }}:</strong>
              <p>{{ comment.message }}</p>
            </div>
            <button
              v-if="authStore.user?.role === 'admin'"
              @click="deleteComment(comment.id)"
              class="ml-4 text-red-600 font-bold hover:text-red-800 transition"
              aria-label="Deletar comentário"
            >
              ×
            </button>
          </li>
        </ul>

        <div class="mt-6 flex justify-center space-x-4">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-800 font-semibold hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ‹ {{ $t('comments.previous') }}
          </button>
          <button
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
            class="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-800 font-semibold hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ $t('comments.next') }} ›
          </button>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 w-full backdrop-blur-md bg-white/15 shadow-xl py-4 px-6">
      <div class="max-w-4xl mx-auto">
        <textarea
          v-model="newComment"
          :placeholder="$t('comments.placeholder')"
          class="w-full rounded-lg p-3 text-sm border border-indigo-300 focus:outline-none resize-none"
          rows="3"
        ></textarea>
        <button
          @click="postComment"
          class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          {{ $t('comments.send') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import { API_BASE } from '../config/api.js'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const videoId = route.params.id

const video = ref(null)
const comments = ref([])
const newComment = ref('')
const currentPage = ref(1)
const pageSize = 5

const fetchVideo = async () => {
  try {
    const res = await fetch(`${API_BASE}/videos`)
    const data = await res.json()
    video.value = data.find(v => v.id === Number(videoId))
  } catch (err) {
    console.error('Erro ao carregar vídeo:', err)
  }
}

const fetchComments = async () => {
  try {
    const res = await fetch(`${API_BASE}/videos/${videoId}/comments`)
    const data = await res.json()
    comments.value = data
  } catch (err) {
    console.error('Erro ao carregar comentários:', err)
  }
}

const postComment = async () => {
  if (!newComment.value.trim()) return

  if (!authStore.user?.id) {
    alert(t('comments.loginRequired'))
    return
  }

  try {
    await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: authStore.user.id,
        videoId: Number(videoId),
        message: newComment.value.trim(),
      }),
    })

    newComment.value = ''
    fetchComments()
  } catch (err) {
    console.error('Erro ao enviar comentário:', err)
  }
}

onMounted(() => {
  fetchVideo()
  fetchComments()
})

const totalPages = computed(() =>
  Math.ceil(comments.value.length / pageSize)
)

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return comments.value.slice(start, start + pageSize)
})

const deleteComment = async (commentId) => {
  if (!confirm(t('comments.confirmDelete'))) return;

  try {
    await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE',
    });
    fetchComments();
  } catch (err) {
    console.error('Erro ao deletar comentário:', err);
  }
};
</script>

<style scoped>
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
}
</style>