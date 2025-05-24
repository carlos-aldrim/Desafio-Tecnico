<template>
  <nav class="bg-white px-6 py-4 shadow">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-700">Streaming App</h1>

      <button @click="menuOpen = !menuOpen" class="md:hidden text-gray-700 focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div class="hidden md:flex items-center space-x-4">
        <NavbarLinks />
      </div>
    </div>

    <div v-if="menuOpen" class="md:hidden mt-4 flex flex-col space-y-2">
      <NavbarLinks />
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import NavbarLinks from './NavbarLinks.vue'

const menuOpen = ref(false)
</script>
