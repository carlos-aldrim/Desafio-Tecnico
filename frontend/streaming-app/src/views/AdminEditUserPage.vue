<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 class="text-3xl sm:text-4xl mb-6 font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ $t('adminEditUser.title') }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4 text-left">
        <BaseInput v-model="form.name" type="text" :placeholder="$t('adminEditUser.namePlaceholder')" />
        <BaseInput v-model="form.email" type="email" :placeholder="$t('adminEditUser.emailPlaceholder')" />

        <select
          v-model="form.role"
          required
          class="input w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
        >
          <option disabled value="" selected>
            {{ $t('adminEditUser.selectRole') }}
          </option>
          <option value="user">{{ $t('adminEditUser.roleUser') }}</option>
          <option value="admin">{{ $t('adminEditUser.roleAdmin') }}</option>
        </select>

        <BaseButton
          type="submit"
          bgColor="bg-indigo-500"
          hoverColor="hover:bg-indigo-600"
        >
          {{ $t('adminEditUser.saveButton') }}
        </BaseButton>
      </form>

      <button
        @click="router.push('/admin')"
        class="inline-flex items-center gap-2 px-4 py-2 mt-6 text-indigo-600 hover:underline hover:rounded-lg text-sm font-medium transition duration-300 ease-in-out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ $t('adminEditUser.backToPanel') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { useI18n } from 'vue-i18n'
import { API_BASE } from '../config/api.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const { t } = useI18n()

const userId = route.params.id
const form = ref({
  name: '',
  email: '',
  role: "",
})

const fetchUser = async () => {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
    if (!res.ok) throw new Error('Fetch error')
    const data = await res.json()
    form.value = {
      name: data.name,
      email: data.email,
      role: data.role,
    }
  } catch {
    alert(t('adminEditUser.errorFetching'))
  }
}

const handleSubmit = async () => {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(form.value),
    })

    if (!res.ok) {
      const err = await res.json()
      alert(err.error || t('adminEditUser.errorUpdating'))
      return
    }

    alert(t('adminEditUser.successUpdating'))
    router.push('/admin')
  } catch {
    alert(t('adminEditUser.requestError'))
  }
}

onMounted(fetchUser)
</script>