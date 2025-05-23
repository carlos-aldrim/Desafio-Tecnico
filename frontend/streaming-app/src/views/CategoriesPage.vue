<template>
  <div class="min-h-screen bg-gradient-to-tr from-indigo-400 via-purple-500 to-blue-700">
    <NavBar />

    <div class="flex flex-col items-center py-10 px-4">
      <h2 class="text-4xl font-extrabold text-white mb-10 drop-shadow-lg">{{ $t('categories.title') }}</h2>

      <CategoryForm
        v-if="addingNew"
        @save="handleSaveNewCategory"
        @cancel="cancelNewCategory"
      />

      <div class="grid gap-4 w-full max-w-xl">
        <CategoryItem
          v-for="category in paginatedCategories"
          :key="category.id"
          :category="category"
          :is-admin="auth.user?.role === 'admin'"
          @save="saveCategory"
          @delete="deleteCategory"
        />
      </div>

      <div v-if="error" class="mt-4 text-red-400 font-semibold">
        {{ $t('categories.errorFetching') }}
      </div>

      <PaginationControls
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="currentPage > 1 ? currentPage-- : null"
        @next="currentPage < totalPages ? currentPage++ : null"
      />
    </div>

    <button
      v-if="auth.user?.role === 'admin' && !addingNew"
      @click="addingNew = true"
      class="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white text-3xl rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition"
      :title="$t('categories.newCategory')"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import { useAuthStore } from '../stores/auth.js'
import { useI18n } from 'vue-i18n'
import { API_BASE } from '../config/api.js'
import PaginationControls from '../components/PaginationControls.vue'
import CategoryItem from '../components/CategoryItem.vue'
import CategoryForm from '../components/CategoryForm.vue'

const { t } = useI18n()

const categories = ref([])
const currentPage = ref(1)
const pageSize = 4
const error = ref(false)
const auth = useAuthStore()

const editingId = ref(null)
const editedName = ref('')

const addingNew = ref(false)
const newCategoryName = ref('')


function cancelEdit() {
  editingId.value = null
  editedName.value = ''
}

function handleSaveNewCategory(name) {
  newCategoryName.value = name
  saveNewCategory()
}

async function saveCategory({ id, name }) {
  if (!name.trim()) {
    alert(t('categories.nameRequired'))
    return
  }

  try {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })

    if (!response.ok) throw new Error(t('categories.updateError'))

    const updated = await response.json()

    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index].name = updated.name
    }

    cancelEdit()
  } catch (err) {
    console.error(err)
    alert(t('categories.updateError'))
  }
}

async function saveNewCategory() {
  if (!newCategoryName.value.trim()) {
    alert(t('categories.nameRequired'))
    return
  }

  try {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName.value.trim() }),
    })

    if (!response.ok) throw new Error(t('categories.createError'))

    const created = await response.json()

    categories.value.unshift(created)
    newCategoryName.value = ''
    addingNew.value = false

    currentPage.value = 1
  } catch (err) {
    console.error(err)
    alert(t('categories.createError'))
  }
}

function cancelNewCategory() {
  newCategoryName.value = ''
  addingNew.value = false
}

const fetchCategories = async () => {
  error.value = false
  try {
    const res = await fetch(`${API_BASE}/categories`)
    if (!res.ok) throw new Error(t('categories.apiResponseError'))

    const data = await res.json()
    categories.value = data
  } catch (err) {
    console.error(t('categories.fetchError'), err)
    error.value = true
  }
}

const deleteCategory = async (id) => {
  if (!confirm(t('categories.confirmDelete'))) return

  try {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error(t('categories.deleteError'))

    categories.value = categories.value.filter(c => c.id !== id)

    if (paginatedCategories.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

  } catch (err) {
    console.error(err)
    alert(t('categories.alertDeleteError'))
  }
}

onMounted(fetchCategories)

const totalPages = computed(() => Math.ceil(categories.value.length / pageSize))
const paginatedCategories = computed(() =>
  categories.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)
</script>

<style scoped>
.category-button {
  cursor: pointer;
}
</style>