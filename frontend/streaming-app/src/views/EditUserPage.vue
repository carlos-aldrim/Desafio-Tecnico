<template>
  <div
  class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-pink-500">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Editar Usuário</h2>
        <button @click="router.push('/')" class="text-sm text-blue-600 hover:underline">Voltar</button>
      </div>
      <form @submit.prevent="handleEdit" class="space-y-4">
        <input v-model="name" placeholder="Nome" class="input" />
        <input v-model="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Nova senha (opcional)" class="input" />
        <button type="submit" class="btn bg-blue-600 hover:bg-blue-700">Salvar Alterações</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

onMounted(() => {
  name.value = authStore.user?.name || ''
  email.value = authStore.user?.email || ''
})

async function handleEdit() {
  const res = await fetch(`http://localhost:3000/users/${authStore.user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authStore.token}`,
    },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value || undefined,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    alert(err.error)
    return
  }

  const updated = await res.json()
  authStore.user = updated
  alert('Dados atualizados com sucesso!')
  router.push('/')
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
  padding: 0.75rem;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
}
</style>
