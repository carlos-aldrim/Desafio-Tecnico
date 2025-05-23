<template>
  <button @click="toggleLanguage" class="absolute top-4 right-4 ml-2">
    <img
      :src="locale === 'pt' ? 'https://flagcdn.com/w40/br.png' : 'https://flagcdn.com/w40/us.png'"
      :alt="locale === 'pt' ? 'Português' : 'English'"
      class="w-6 h-6 rounded shadow"
    />
  </button>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
function toggleLanguage() {
  locale.value = locale.value === 'pt' ? 'en' : 'pt'
}
</script>
