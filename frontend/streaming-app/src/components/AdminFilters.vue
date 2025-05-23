<template>
  <div class="mb-8 w-full max-w-4xl flex justify-end">
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="p-2 rounded-lg shadow-md text-indigo-900 bg-white focus:outline-none"
    >
      <option value="">{{ t('adminPanel.selectAll') }}</option>
      <option value="admin">{{ t('adminPanel.roleAdmin') }}</option>
      <option value="user">{{ t('adminPanel.roleUser') }}</option>
    </select>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>