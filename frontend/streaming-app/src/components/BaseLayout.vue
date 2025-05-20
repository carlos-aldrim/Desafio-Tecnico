<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-blue-600 text-white p-4">
      <h1 class="text-xl font-bold">Streaming App</h1>
    </header>
    <main class="flex-grow p-6 bg-gray-50">
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'BaseLayout'
}
</script>
