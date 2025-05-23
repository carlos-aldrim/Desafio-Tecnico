<template>
  <div
    class="bg-white bg-opacity-90 rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
  >
    <div>
      <h3 class="text-lg sm:text-xl font-semibold text-indigo-900 truncate">
        {{ admin.name }}
      </h3>
      <p class="text-gray-700 text-sm truncate">{{ admin.email }}</p>
    </div>

    <div class="flex justify-center items-center">
      <span
        class="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap select-none"
      >
        {{ admin.role.toUpperCase() }}
      </span>

      <button
        @click.stop="$emit('edit', admin.id)"
        :title="t('adminPanel.editUser')"
        class="text-indigo-600 hover:text-indigo-800 font-bold text-ml leading-none ml-1 p-1 rounded-full transition"
      >
        ✎
      </button>

      <button
        @click.stop="$emit('delete', admin.id)"
        :title="t('adminPanel.deleteUser')"
        class="text-red-600 hover:text-red-800 font-bold text-xl leading-none ml-1 p-1 rounded-full transition"
        style="cursor: pointer;"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
defineProps(['admin'])
const { t } = useI18n()
</script>