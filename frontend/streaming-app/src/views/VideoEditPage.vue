<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 class="text-3xl sm:text-4xl mb-4 font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ t('videoEdit.editVideoTitle') }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput required v-model="title" type="text" :placeholder="t('videoEdit.title')" />
        <BaseInput required v-model="description" type="text" :placeholder="t('videoEdit.description')" />
        <BaseInput required v-model="url" type="text" :placeholder="t('videoEdit.url')" />
        <select required v-model="categoryId" class="input">
          <option disabled value="">{{ t('videoEdit.selectCategory') }}</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <BaseButton
          type="submit"
          bgColor="bg-indigo-500"
          hoverColor="hover:bg-indigo-600"
        >
          {{ t('videoEdit.updateVideo') }}
        </BaseButton>
      </form>

      <button
        @click="$router.push('/videos')"
        class="inline-flex items-center gap-2 px-4 py-2 mt-6 text-indigo-600 hover:underline hover:rounded-lg text-sm font-medium transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('videoEdit.back') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { API_BASE } from '../config/api.js'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const title = ref('')
const description = ref('')
const url = ref('')
const categoryId = ref('')
const categories = ref([])

onMounted(async () => {
  const catRes = await fetch(`${API_BASE}/categories`)
  categories.value = await catRes.json()

  const videoId = route.params.id
  const videoRes = await fetch(`${API_BASE}/videos/${videoId}`)
  const video = await videoRes.json()

  title.value = video.title
  description.value = video.description
  url.value = video.url
  categoryId.value = video.categoryId
})

async function handleSubmit() {
  const videoId = route.params.id

  const res = await fetch(`${API_BASE}/videos/${videoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: title.value,
      description: description.value,
      url: url.value,
      categoryId: Number(categoryId.value),
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    alert(err.error || t('videoEdit.updateError'))
    return
  }

  router.push('/videos')
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
}
</style>