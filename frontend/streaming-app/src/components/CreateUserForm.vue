<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 text-left">
    <BaseInput required v-model="form.name" type="text" :placeholder="t('adminCreateUser.name')" />
    <BaseInput required v-model="form.email" type="email" :placeholder="t('adminCreateUser.email')" />
    <BaseInput required v-model="form.password" type="password" :placeholder="t('adminCreateUser.password')" />

    <RoleSelect v-model="form.role" />

    <BaseButton
      type="submit"
      bgColor="bg-indigo-500"
      hoverColor="hover:bg-indigo-600"
    >
      {{ t('adminCreateUser.submit') }}
    </BaseButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import RoleSelect from './RoleSelect.vue'
import { API_BASE } from '../config/api.js'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const form = ref({
  name: '',
  email: '',
  password: '',
  role: '',
})

const handleSubmit = async () => {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(form.value),
    })

    if (!res.ok) {
      const err = await res.json()
      alert(err.error || t('adminCreateUser.errorCreate'))
      return
    }

    alert(t('adminCreateUser.successCreate'))
    router.push('/admin')
  } catch {
    alert(t('adminCreateUser.errorRequest'))
  }
}
</script>
