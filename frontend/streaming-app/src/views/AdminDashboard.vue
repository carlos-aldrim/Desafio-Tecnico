<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700 relative">
    <NavBar />

    <div class="flex flex-col items-center py-10 px-4">
      <h2 class="text-4xl text-left font-extrabold text-white mb-6 drop-shadow-lg">
        {{ t('adminPanel.title') }}
      </h2>

      <AdminFilters v-model="selectedRole" />

      <div class="grid gap-4 w-full max-w-4xl">
        <AdminCard
          v-for="admin in paginatedAdmins"
          :key="admin.id"
          :admin="admin"
          @edit="editUser"
          @delete="deleteUser"
        />
      </div>

      <PaginationControls
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="currentPage > 1 ? currentPage-- : null"
        @next="currentPage < totalPages ? currentPage++ : null"
      />
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
import AdminCard from '../components/AdminCard.vue'
import AdminFilters from '../components/AdminFilters.vue'
import PaginationControls from '../components/PaginationControls.vue'
import { useAuthStore } from '../stores/auth.js'
import { useRouter } from 'vue-router'
import { API_BASE } from '../config/api.js'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const admins = ref([])
const currentPage = ref(1)
const pageSize = 4
const selectedRole = ref('')

const fetchAdmins = async () => {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    if (!response.ok) throw new Error(t('adminPanel.fetchUsers'))
    admins.value = await response.json()
  } catch (error) {
    console.error('Erro:', error)
  }
}

const deleteUser = async (userId) => {
  if (!confirm(t('adminPanel.confirmDelete'))) return
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authStore.token}` },
  })

  if (res.ok) {
    alert(t('adminPanel.userDeleted'))
    await fetchAdmins()
    if (userId === authStore.user.id) router.push('/login')
  } else {
    const err = await res.json()
    alert(err.error)
  }
}

const editUser = (userId) => router.push(`/admin/editar/${userId}`)
const createAdmin = () => router.push('/admin/novo')

onMounted(async () => {
  try {
    await authStore.fetchUser()
    await fetchAdmins()
    if (authStore.user?.role !== 'admin') router.push('/')
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