<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-600 to-blue-700">
    <NavBar />
    <div class="flex items-center justify-center h-[calc(100vh-80px)] px-4">
      <WelcomeBanner :name="authStore.user?.name || '...'" :description="$t('home.description')" />
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import WelcomeBanner from '../components/WelcomeBanner.vue'
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
</script>
