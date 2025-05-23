<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 class="text-3xl sm:text-4xl mb-6 font-extrabold text-indigo-600 drop-shadow-lg tracking-tight">
        {{ $t('adminEditUser.title') }}
      </h2>

      <EditUserForm :userId="userId" :form="form" />
      <BackToAdminButton />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import EditUserForm from '../components/EditUserForm.vue'
import BackToAdminButton from '../components/BackToAdminButton.vue'
import { useI18n } from 'vue-i18n'
import { API_BASE } from '../config/api.js'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()

const userId = route.params.id
const form = ref({
  name: '',
  email: '',
  role: '',
})

const fetchUser = async () => {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
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

onMounted(fetchUser)
</script>
