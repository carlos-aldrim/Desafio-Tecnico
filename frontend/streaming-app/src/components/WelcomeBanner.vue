<template>
  <div
    class="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-center"
  >
    <h2 class="text-5xl sm:text-6xl font-extrabold mb-6 text-indigo-900 animate-fadeInUp">
      <i18n-t keypath="home.welcome">
        <template #name>
          <span class="modern-name">{{ name }}</span>
        </template>
      </i18n-t>
    </h2>
    <p class="text-indigo-800 text-lg sm:text-xl font-semibold">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  description: String
})
</script>

<style scoped>
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeInUp {
  animation: fadeInUp 1.2s ease forwards;
}

.modern-name {
  background: linear-gradient(90deg, #7c3aed, #4f46e5, #3b82f6, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  font-weight: 900;
  text-decoration: underline;
  text-decoration-thickness: 4px;
  text-underline-offset: 6px;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.15));
  overflow: hidden;
  display: inline-block;
  cursor: default;
  animation: shine 2.5s infinite;
}

@keyframes shine {
  0% {
    background-position: -200%;
  }
  100% {
    background-position: 200%;
  }
}
</style>