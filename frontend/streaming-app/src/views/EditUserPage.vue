<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 class="text-3xl sm:text-4xl mb-4 font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ t('profile.title') }}
      </h2>

      <form @submit.prevent="handleEdit" class="space-y-4">
        <BaseInput v-model="name" type="text" :placeholder="t('profile.namePlaceholder')" />
        <BaseInput v-model="email" type="email" :placeholder="t('profile.emailPlaceholder')" />
        <BaseInput v-model="password" type="email" :placeholder="t('profile.passwordPlaceholder')" />
        <BaseButton
          type="submit"
          bgColor="bg-indigo-500"
          hoverColor="hover:bg-indigo-600"
        >
          {{ t('profile.saveButton') }}
        </BaseButton>
      </form>

      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 px-4 py-2 mt-6 text-indigo-600 hover:underline hover:rounded-lg text-sm font-medium transition duration-300 ease-in-out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('profile.backButton') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

const { t } = useI18n()

onMounted(() => {
  name.value = authStore.user?.name || ''
  email.value = authStore.user?.email || ''
})

async function handleEdit() {
  const res = await fetch(`http://localhost:3000/users/${authStore.user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authStore.token}`,
    },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value || undefined,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    alert(err.error)
    return
  }

  const updated = await res.json()
  authStore.user = updated
  alert(t('profile.success'))
  router.push('/')
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
.btn {
  width: 100%;
  padding: 0.75rem;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
}
</style>