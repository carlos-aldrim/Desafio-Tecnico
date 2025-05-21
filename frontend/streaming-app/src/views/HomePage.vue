<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-pink-500">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 class="text-3xl font-extrabold mb-6 text-gray-800">Bem-vindo, {{ authStore.user?.name }}</h2>
      <p class="text-gray-600 mb-6">Email: {{ authStore.user?.email }}</p>

      <div class="space-y-4">
        <button @click="router.push('/editar')" class="btn bg-yellow-500 hover:bg-yellow-600">Editar Usuário</button>
        <button @click="handleDelete" class="btn bg-red-500 hover:bg-red-600">Deletar Usuário</button>
        <button @click="handleLogout" class="btn bg-gray-500 hover:bg-gray-600">Sair</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

async function handleDelete() {
  if (!confirm('Tem certeza que deseja excluir sua conta?')) return

  console.log(authStore.token);

  const res = await fetch(`http://localhost:3000/users/${authStore.user.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authStore.token}1` },
  })

  console.log(res);

  if (res.ok) {
    alert('Conta excluída.')
    authStore.logout()
    router.push('/login')
  } else {
    const err = await res.json()
    alert(err.error)
  }
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
