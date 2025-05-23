<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 text-left">
    <BaseInput v-model="localForm.name" type="text" :placeholder="$t('adminEditUser.namePlaceholder')" />
    <BaseInput v-model="localForm.email" type="email" :placeholder="$t('adminEditUser.emailPlaceholder')" />

    <select
      v-model="localForm.role"
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
</template>

<script setup>
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { API_BASE } from '@/config/api.js'
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'

const props = defineProps({
  userId: String,
  form: Object
})

const localForm = ref({ ...props.form })

watch(() => props.form, (newForm) => {
  localForm.value = { ...newForm }
})

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const handleSubmit = async () => {
  try {
    const res = await fetch(`${API_BASE}/users/${props.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(localForm.value),
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
</script>
