<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700 relative">
    <NavBar />

    <div class="flex flex-col items-center py-10 px-4">
      <h2 class="text-4xl text-right font-extrabold text-white mb-6 drop-shadow-lg">
        {{ t('adminPanel.title') }}
      </h2>

      <div class="mb-8 w-full max-w-4xl flex justify-end">
        <select
          v-model="selectedRole"
          class="p-2 rounded-lg shadow-md text-indigo-900 bg-white focus:outline-none"
        >
          <option value="">{{ t('adminPanel.selectAll') }}</option>
          <option value="admin">{{ t('adminPanel.roleAdmin') }}</option>
          <option value="user">{{ t('adminPanel.roleUser') }}</option>
        </select>
      </div>

      <div class="grid gap-4 w-full max-w-4xl">
        <div
          v-for="admin in paginatedAdmins"
          :key="admin.id"
          class="bg-white bg-opacity-90 rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-indigo-900 truncate">
              {{ admin.name }}
            </h3>
            <p class="text-gray-700 text-sm truncate">{{ admin.email }}</p>
          </div>

          <div class="flex justify-center items-center">
            <span class="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap select-none">
              {{ admin.role.toUpperCase() }}
            </span>

            <button
              @click.stop="$router.push(`/admin/editar/${admin.id}`)"
              :title="t('adminPanel.editUser')"
              class="text-indigo-600 hover:text-indigo-800 font-bold text-ml leading-none ml-1 p-1 rounded-full transition"
            >
              ✎
            </button>

            <button
              @click.stop="deleteUser(admin.id)"
              :title="t('adminPanel.deleteUser')"
              class="text-red-600 hover:text-red-800 font-bold text-xl leading-none ml-1 p-1 rounded-full transition"
              style="cursor: pointer;"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex space-x-6">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ t('adminPanel.prev') }}
        </button>
        <button
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
          class="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ t('adminPanel.next') }}
        </button>
      </div>
    </div>

    <button
      @click="createAdmin"
      class="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white text-3xl rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition"
      :title="t('adminPanel.addAdmin')"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NavBar from '../components/NavBar.vue'
import { useAuthStore } from '../stores/auth.js'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const authStore = useAuthStore()
const router = useRouter()

const admins = ref([])
const currentPage = ref(1)
const pageSize = 5
const selectedRole = ref('')

const fetchAdmins = async () => {
  try {
    const response = await fetch('http://localhost:3000/users', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    if (!response.ok) throw new Error(t('adminPanel.fetchUsers'))
    admins.value = await response.json()
  } catch (error) {
    console.error('Erro:', error)
  }
}

const deleteUser = async (userId) => {
  if (!confirm(t('adminPanel.confirmDelete'))) return

  const res = await fetch(`http://localhost:3000/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authStore.token}` },
  })

  if (res.ok) {
    alert(t('adminPanel.userDeleted'))
    await fetchAdmins()

    if (userId === authStore.user.id) {
      router.push('/login')
    }
  } else {
    const err = await res.json()
    alert(err.error)
  }
}

const createAdmin = () => {
  router.push('/admin/novo')
}

onMounted(async () => {
  try {
    await authStore.fetchUser()
    await fetchAdmins()

    if (authStore.user?.role !== 'admin') {
      router.push('/')
      return
    }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
  }
})

const filteredAdmins = computed(() => {
  if (!selectedRole.value) return admins.value
  return admins.value.filter((user) => user.role === selectedRole.value)
})

const totalPages = computed(() => Math.ceil(filteredAdmins.value.length / pageSize))
const paginatedAdmins = computed(() =>
  filteredAdmins.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)
</script>
