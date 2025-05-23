<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    required
    class="input w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
  >
    <option disabled value="">{{ t('adminCreateUser.selectRole') }}</option>
    <option value="user">{{ t('adminCreateUser.roleUser') }}</option>
    <option value="admin">{{ t('adminCreateUser.roleAdmin') }}</option>
  </select>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
const { t } = useI18n()
</script>
