<template>
  <div class="mb-6 w-full max-w-xl bg-white bg-opacity-90 rounded-xl shadow-md p-4 flex gap-2 items-center">
    <input
      v-model="name"
      @keyup.enter="save"
      @keyup.esc="cancel"
      class="flex-1 text-lg text-indigo-900 font-semibold p-2 rounded border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      :placeholder="t('categories.newCategory')"
      autofocus
    />
    <button @click="save" class="text-blue-600 text-md font-bold px-3 hover:text-indigo-800 transition" :disabled="!name.trim()" :title="t('categories.save')">✔</button>
    <button @click="cancel" class="text-red-600 text-2xl font-bold px-3 hover:text-red-800 transition" :title="t('categories.cancel')">×</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['save', 'cancel'])
const name = ref('')

function save() {
  if (!name.value.trim()) {
    alert(t('categories.nameRequired'))
    return
  }
  emit('save', name.value.trim())
  name.value = ''
}

function cancel() {
  name.value = ''
  emit('cancel')
}
</script>
