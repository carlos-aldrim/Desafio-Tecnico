<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-pink-500">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-3xl font-extrabold mb-8 text-center text-gray-800">Cadastro</h2>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <input v-model="name" type="text" placeholder="Nome" class="input" required />
        <input v-model="email" type="email" placeholder="Email" class="input" required />
        <input v-model="password" type="password" placeholder="Senha" class="input" required />
        <button type="submit" class="btn">Cadastrar</button>
        <router-link to="/login" class="block text-center text-sm text-indigo-600 mt-2">Já tem conta? Entrar</router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

async function handleRegister() {
  const res = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
  })

  if (!res.ok) {
    const err = await res.json()
    alert(err.error)
    return
  }

  alert('Usuário cadastrado!')
  router.push('/login')
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
.btn {
  width: 100%;
  background: #4f46e5;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
}
</style>
