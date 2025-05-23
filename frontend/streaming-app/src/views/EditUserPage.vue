<template>
  <AuthLayout>
    <AuthFormContainer>
      <h2 class="text-3xl sm:text-4xl mb-4 text-center font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ t('profile.title') }}
      </h2>

      <form @submit.prevent="handleEdit" class="space-y-4">
        <BaseInput v-model="name" type="text" :placeholder="t('profile.namePlaceholder')" />
        <BaseInput v-model="email" type="email" :placeholder="t('profile.emailPlaceholder')" />
        <BaseInput v-model="password" type="password" :placeholder="t('profile.passwordPlaceholder')" />
        <BaseButton type="submit" bgColor="bg-indigo-500" hoverColor="hover:bg-indigo-600">
          {{ t('profile.saveButton') }}
        </BaseButton>
      </form>

      <button @click="router.push('/')" class="w-full inline-flex justify-center items-center gap-2 px-4 py-2 mt-6 text-indigo-600 hover:underline hover:rounded-lg text-sm font-medium transition duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('profile.backButton') }}
      </button>
    </AuthFormContainer>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import { API_BASE } from '../config/api.js'

import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import AuthLayout from '../components/AuthLayout.vue'
import AuthFormContainer from '../components/AuthFormContainer.vue'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const name = ref('')
const email = ref('')
const password = ref('')

onMounted(() => {
  name.value = authStore.user?.name || ''
  email.value = authStore.user?.email || ''
})

async function handleEdit() {
  const res = await fetch(`${API_BASE}/users/${authStore.user.id}`, {
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

  authStore.user = await res.json()
  alert(t('profile.success'))
  router.push('/')
}
</script>
